// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import { CurrentUserNav, Box } from '@admin-bro/design-system';

function allowOverride(
  OriginalComponent,
  name,
) {
  const WrapperComponent = (props) => {
    let globalAny = window;
    globalAny = window;

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

const LoggedIn = (props) => {
  const { session, paths } = props;

  const dropActions = [{
    label: 'Logout',
    onClick: (event) => {
      event.preventDefault();
      // eslint-disable-next-line no-undef
      window.location.href = paths.logoutPath;
    },
    icon: 'Logout',
  }];

  return (
    <Box flexShrink={0}>
      <CurrentUserNav
        name={session.email}
        title={session.title}
        avatarUrl={session.avatarUrl}
        dropActions={dropActions}
      />
    </Box>
  );
};

const OverridableLoggedIn = allowOverride(LoggedIn, 'LoggedIn');

export {
  OverridableLoggedIn as default,
  OverridableLoggedIn as LoggedIn,
};
