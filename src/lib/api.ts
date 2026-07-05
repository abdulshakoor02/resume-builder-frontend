const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData?: boolean
): Promise<T> {
  const headers: Record<string, string> = {};

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = { message: res.statusText };
    }
    throw new ApiError(
      (errorBody as { message?: string }).message || res.statusText,
      res.status,
      errorBody
    );
  }

  if (res.headers.get("content-type")?.includes("application/pdf")) {
    return res.blob() as unknown as T;
  }

  return res.json();
}

export const api = {
  auth: {
    signup: (email: string, password: string) =>
      request<{ token: string; user: { id: string; email: string } }>(
        "POST",
        "/api/auth/signup",
        { email, password }
      ),
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; email: string } }>(
        "POST",
        "/api/auth/login",
        { email, password }
      ),
  },

  resumes: {
    create: (formData: FormData) =>
      request<{ resume_id: string; pdf_url?: string }>(
        "POST",
        "/api/resumes",
        formData,
        true
      ),
    list: () =>
      request<{ resumes: Resume[] }>("GET", "/api/resumes"),
    get: (id: string) =>
      request<Resume>("GET", `/api/resumes/${id}`),
    refine: async (id: string, prompt: string, photo?: File | null) => {
      if (photo) {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("photo", photo);
        return request<{ pdf_url: string }>("POST", `/api/resumes/${id}/refine`, formData, true);
      }
      return request<{ pdf_url: string }>("POST", `/api/resumes/${id}/refine`, {
        prompt,
      });
    },
    pdf: async (id: string) => {
      const res = await fetch(
        `${BACKEND_URL}/api/resumes/${id}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch PDF");
      return res.blob();
    },
  },

  upload: {
    file: (formData: FormData) =>
      request<{ file_id: string; filename: string; extracted_text: string }>(
        "POST",
        "/api/upload",
        formData,
        true
      ),
  },

  usage: {
    get: () =>
      request<UsageResponse>("GET", "/api/usage"),
  },
};

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  status: "draft" | "generating" | "completed" | "failed";
  current_pdf_path: string;
  current_pdf_url: string;
  structured_data?: Record<string, unknown>;
  revisions: Revision[];
  created_at: string;
  updated_at: string;
}

export interface Revision {
  prompt: string;
  pdf_path: string;
  pdf_url: string;
  created_at: string;
}

export interface UsageResponse {
  resumes_created: number;
  total_revisions: number;
  free_resume_limit: number;
  free_revision_limit: number;
  can_create: boolean;
  can_revise: boolean;
}
