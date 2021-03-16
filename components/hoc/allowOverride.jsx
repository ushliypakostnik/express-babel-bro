function allowOverride(
  OriginalComponent,
  name,
) {
  const WrapperComponent = (props) => {
    // eslint-disable-next-line no-undef
    let globalAny = window;
    // eslint-disable-next-line no-undef
    globalAny = window;

    // eslint-disable-next-line no-unused-vars
    let Component = OriginalComponent;

    if (globalAny.AdminBro
      && globalAny.AdminBro.UserComponents
      && globalAny.AdminBro.UserComponents[name]
    ) {
      Component = globalAny.AdminBro.UserComponents[name];
      return <Component {...props} OriginalComponent={OriginalComponent} />;
    }

    return <Component {...props} />;
  };

  return WrapperComponent;
}

export {
  allowOverride as default,
  allowOverride,
};
