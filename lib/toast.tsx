import { Colors, SemanticColors } from '@/constants/Colors';
import {
  BaseToastProps,
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastConfig,
} from 'react-native-toast-message';

const toastStyles: BaseToastProps = {
  style: {
    backgroundColor: Colors.light.background,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
  },
  text1Style: {
    color: Colors.light.tint,
    fontWeight: '400',
  },
  text2Style: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: '400',
  },
};

const toastInfoStyles: BaseToastProps = {
  ...toastStyles,
  style: {
    ...(toastStyles.style as object),
    borderLeftColor: SemanticColors.info,
  },
};

const toastSuccessStyles: BaseToastProps = {
  ...toastStyles,
  style: {
    ...(toastStyles.style as object),
    borderLeftColor: SemanticColors.success,
  },
};

const toastErrorStyles: BaseToastProps = {
  ...toastStyles,
  style: {
    ...(toastStyles.style as object),
    borderLeftColor: SemanticColors.error,
  },
};

export const toastConfig: ToastConfig = {
  info: (props) => <InfoToast {...props} {...toastInfoStyles} />,
  success: (props) => <SuccessToast {...props} {...toastSuccessStyles} />,
  error: (props) => <ErrorToast {...props} {...toastErrorStyles} />,
};
