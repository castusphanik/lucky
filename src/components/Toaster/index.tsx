import { FC, ReactNode } from "react";
import { Toaster, useToasterStore } from "react-hot-toast";
import "./styles.scss";

type Props = { children: ReactNode };

const ToastProvider: FC<Props> = ({ children }) => {
  // Watch react-hot-toast’s internal store
  const { toasts } = useToasterStore();
  const hasVisible = toasts.some((t) => t.visible);

  return (
    <>
      {children}

      {hasVisible && <div className="toast-overlay" />}

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#E7ECF1", color: "#000", fontSize: "0.9rem"},
          success: { iconTheme: { primary: "#12A25E", secondary: "#fff" } },
          error: { style: { background: "#E7ECF1", color: "#000" } },
        }}
      />
    </>
  );
};

export default ToastProvider;
