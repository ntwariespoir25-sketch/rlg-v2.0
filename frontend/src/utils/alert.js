import Swal from 'sweetalert2';

export const showSuccess = (title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonColor: 'rgb(6, 237, 164)',
    confirmButtonText: 'Great!',
    timer: 3000,
    showConfirmButton: true
  });
};

export const showError = (title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonColor: 'rgb(14, 212, 150)',
    confirmButtonText: 'OK'
  });
};

export const showWarning = (title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    confirmButtonColor: 'rgb(16, 216, 153)',
    confirmButtonText: 'Got it'
  });
};

export const showInfo = (title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'info',
    confirmButtonColor: 'rgb(6, 184, 128)',
    confirmButtonText: 'Thanks'
  });
};

export const showConfirm = async (title, message) => {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: 'rgb(14, 215, 151)',
    cancelButtonColor: 'red',
    confirmButtonText: 'Yes, proceed!',
    cancelButtonText: 'Cancel'
  });
  return result.isConfirmed;
};

export const showToast = (message, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: icon,
    title: message
  });
};