

import { toast } from "react-hot-toast";

export const useToast = () => ({
  success: (m: string) => toast.success(m),
  error:   (m: string) => toast.error(m),
  info:    (m: string) => toast(m),
  loading: (m: string) => toast.loading(m),
  dismiss: (id?: string) => toast.dismiss(id),
});

