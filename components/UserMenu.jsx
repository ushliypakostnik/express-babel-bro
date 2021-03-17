// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import { CurrentUserNav, Box } from '@admin-bro/design-system';

// hoc
// eslint-disable-next-line import/extensions, import/no-unresolved
import allowOverride from './hoc/allowOverride';

const UserMenu = (props) => {
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

  // console.log('session', session);

  return (
    <Box flexShrink={0}>
      <CurrentUserNav
        name={session.email}
        title={session.role}
        avatarUrl={session.avatar}
        dropActions={dropActions}
      />
    </Box>
  );
};

const OverridableLoggedIn = allowOverride(UserMenu, 'UserMenu');

export {
  OverridableLoggedIn as default,
  OverridableLoggedIn as UserMenu,
};
