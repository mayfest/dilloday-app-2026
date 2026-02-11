import {
  BaseToastProps,
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastConfig,
} from 'react-native-toast-message';

export const theme = {
  background: '#f0e9d3',
  tabBarBackground: '#d1555a',
  tabBarColor: '#f0e9d3',

  primary: '#d1555a',
  dark: '#13381f',

  schedulePageIndicator: '#13381f',

  navigationColor: '#13381f',

  announcementsBackgroundLevel0: '#f0e9d3',
  announcementsBackgroundLevel1: '#6c822c',
  announcementsBackgroundLevel2: '#459eca',
  announcementsBackgroundLevel3: '#d1555a',

  announcementsTextLight: '#f0e9d3',
  announcementsTextDark: '#13381f',

  artistTitle: '#13381f',
  artistTime: '#d1555a',
  artistDescription: '#13381f',

  toastBackground: '#13381f',
  toastText: '#f0e9d3',
  toastInfo: '#459eca',
  toastSuccess: '#6c822c',
  toastError: '#d1555a',

  headingRegular: 'Poppins-Regular',
  headingBold: 'Poppins-Bold',
  bodyRegular: 'Cabin-Regular',
  bodyBold: 'Poppins_600SemiBold',

  homeHeading: '#13381f',

  announcementPanelBackground: '#d1555a',
  announcementPanelText: '#f0e9d3',

  timerPanelBackground: '#13381f',
  timerPanelText: '#f0e9d3',

  schedulePanelNowBackground: '#13381f',
  schedulePanelNextBackground: '#6c822c',
  schedulePanelText: '#f0e9d3',
  indicatorNow: '#d1555a',
  indicatorNext: '#f8b547',

  socialPanelBackground: '#459eca',
  socialPanelText: '#f0e9d3',
  socialPanelBadge1: '#13381f',
  socialPanelBadge2: '#f8b547',
  socialPanelBadge3: '#6c822c',
  socialPanelBadge4: '#d1555a',
  socialPanelBadgeTextLight: '#f0e9d3',
  socialPanelBadgeTextDark: '#13381f',

  socialModalBackground: '#173885',
  socialModalText: '#f0e9d3',
  socialModalErrorText: '#d1555a',
  socialModalMatchText: '#f8b547',
};

export const starColors = [
  '#f8b547', // yellow
  '#13381f', // dark green
  '#6c822c', // light green
  '#459eca', // blue
  '#d1555a', // red
];

const toastStyles: BaseToastProps = {
  style: {
    backgroundColor: theme.toastBackground,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
  },
  text1Style: {
    color: theme.toastText,
    fontSize: 16,
  },
  text2Style: {
    color: theme.toastText,
    fontSize: 14,
  },
};

const toastInfoStyles: BaseToastProps = {
  ...toastStyles,
  style: {
    ...(toastStyles.style as object),
    borderLeftColor: theme.toastInfo,
  },
};

const toastSuccessStyles: BaseToastProps = {
  ...toastStyles,
  style: {
    ...(toastStyles.style as object),
    borderLeftColor: theme.toastSuccess,
  },
};

const toastErrorStyles: BaseToastProps = {
  ...toastStyles,
  style: {
    ...(toastStyles.style as object),
    borderLeftColor: theme.toastError,
  },
};

export const toastConfig: ToastConfig = {
  info: (props) => <InfoToast {...props} {...toastInfoStyles} />,
  success: (props) => <SuccessToast {...props} {...toastSuccessStyles} />,
  error: (props) => <ErrorToast {...props} {...toastErrorStyles} />,
};
