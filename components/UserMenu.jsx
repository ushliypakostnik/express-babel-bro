import { createGlobalStyle } from 'styled-components';
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import { CurrentUserNav, Box } from '@admin-bro/design-system';

import config from '../config';

// hoc
// eslint-disable-next-line import/extensions, import/no-unresolved
import allowOverride from './hoc/allowOverride';

// eslint-disable-next-line no-unused-vars
const GlobalStyle = createGlobalStyle`
  section[data-testid="property-edit-image.key"] {
    display: none;
  }
  
  section[data-testid="property-edit-image.type"] {
    display: none;
  }
  
  section[data-testid="property-edit-image.image.file"] .admin-bro_Label {
    display: none;
  }
`;

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
    <>
      <GlobalStyle />
      <Box flexShrink={0}>
        <CurrentUserNav
          name={session.email}
          title={session.role}
          avatarUrl={`${config.BUCKET_ROOT}${config.BUCKET}/${session.image.key}`}
          dropActions={dropActions}
        />
      </Box>
    </>
  );
};

const OverridableLoggedIn = allowOverride(UserMenu, 'UserMenu');

export {
  OverridableLoggedIn as default,
  OverridableLoggedIn as UserMenu,
};
