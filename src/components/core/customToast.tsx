import { toast } from "sonner";
import { X, Info, AlertTriangle } from "lucide-react";
import React from "react";
import SuccessIcon from "../ui/icons/toast/SuccessIcon";
import ErrorIcon from "../ui/icons/toast/ErrorIcon";
import WarningIcon from "../ui/icons/toast/WarningIcon";
import InfoIcon from "../ui/icons/toast/InfoIcon";

const CloseButton = ({ id }: { id: number | string }) => (
  <button
    onClick={() => toast.dismiss(id)}
    className="ml-4   text-gray-500 hover:text-gray-800"
  >
    <X size={16} />
  </button>
);

type ToastOptions = {
  message: string;
  icon?: React.ReactNode;
};

type PromiseOptions<T> = {
  promise: Promise<T>;
  loading: string;
  success: string;
  error: string;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
};

export const AppToast = {
  success: ({ message, icon }: ToastOptions) =>
    toast.custom((id) => (
      <div className="w-[356px] flex items-center justify-center">
        <div className=" flex items-center  bg-green-100 border border-green-300 rounded-lg p-3 shadow-md">
          {icon ?? <SuccessIcon className="w-5 h-5 text-green-600" />}
          <div className="ml-2 font-medium text-green-600 text-smd tracking-wide">
            {message}
          </div>
          <CloseButton id={id} />
        </div>
      </div>
    )),

  error: ({ message, icon }: ToastOptions) =>
    toast.custom((id) => (
      <div className="w-[356px] flex items-center justify-center">
        <div className="flex items-center  bg-red-100 border border-red-300 rounded-lg p-3 shadow-md">
          {icon ?? <ErrorIcon className="w-5 h-5 text-red-600" />}
          <span className="ml-2 font-medium text-red-600 text-smd tracking-wide">
            {message}
          </span>
          <CloseButton id={id} />
        </div>
      </div>
    )),

  info: ({ message, icon }: ToastOptions) =>
    toast.custom((id) => (
      <div className="w-[356px] flex items-center justify-center">
        <div className="flex items-center bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-md">
          {icon ?? <InfoIcon className="w-5 h-5 text-blue-600" />}
          <span className="ml-2 font-medium text-blue-600 text-smd tracking-wide">
            {message}
          </span>
          <CloseButton id={id} />
        </div>
      </div>
    )),

  warning: ({ message, icon }: ToastOptions) =>
    toast.custom((id) => (
      <div className="w-[356px] flex items-center justify-center">
        <div className="flex items-center bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-md">
          {icon ?? <WarningIcon className="w-5 h-5 text-yellow-600" />}
          <span className="ml-2 font-medium text-yellow-700 text-smd tracking-wide">
            {message}
          </span>
          <CloseButton id={id} />
        </div>
      </div>
    )),

  promise: <T,>({
    promise,
    loading,
    success,
    error,
    successIcon,
    errorIcon,
  }: PromiseOptions<T>) =>
    toast.promise(promise, {
      loading: loading,
      success: () => (
        <div className="w-[356px] flex items-center justify-center">
          <div className="flex items-center">
            {successIcon ?? <SuccessIcon className="w-5 h-5 text-green-600" />}
            <span className="ml-2 font-medium text-green-600 text-smd tracking-wide">
              {success}
            </span>
          </div>
        </div>
      ),
      error: () => (
        <div className="w-[356px] flex items-center justify-center">
          <div className="flex items-center">
            {errorIcon ?? <ErrorIcon className="w-5 h-5 text-red-600" />}
            <span className="ml-2 font-medium text-red-600 text-smd tracking-wide">
              {error}
            </span>
          </div>
        </div>
      ),
    }),
};
