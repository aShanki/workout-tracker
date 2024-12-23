const toastFn = jest.fn();

export const useToast = () => {
  return {
    toast: toastFn
  };
};

export const toast = toastFn;