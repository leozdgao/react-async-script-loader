declare module 'react-async-script-loader' {
  type scriptType = string | string[];

  type scriptLoaderType = (...args: scriptType[]) => scriptLoaderHOC;

  type scriptLoaderHOC = <P extends scriptLoaderInjectedProps, T extends React.ComponentClass<P>>(
    Component: T & React.ComponentClass<P>,
  ) => React.ComponentType<Omit<P, keyof scriptLoaderInjectedProps>>;

  type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

  export type scriptLoaderInjectedProps = {
    isScriptLoaded: boolean;
    isScriptLoadSucceed: boolean;
    onScriptLoaded: () => void;
  };

  const scriptLoader: scriptLoaderType;
  export default scriptLoader;
}
