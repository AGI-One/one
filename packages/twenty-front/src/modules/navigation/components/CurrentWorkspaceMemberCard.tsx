import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import { IconUser } from 'twenty-ui/display';

const StyledContainer = styled(Link)`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border.color.medium};
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3)};
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const StyledIconContainer = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  flex-shrink: 0;
`;

const StyledUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const StyledUserName = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledUserEmail = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.size.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CurrentWorkspaceMemberCard = () => {
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);

  if (!currentWorkspaceMember) {
    return null;
  }

  const userFullName = `${currentWorkspaceMember.name.firstName ?? ''} ${
    currentWorkspaceMember.name.lastName ?? ''
  }`.trim();

  return (
    <StyledContainer to={getSettingsPath(SettingsPath.ProfilePage)}>
      <StyledIconContainer>
        <IconUser />
      </StyledIconContainer>
      <StyledUserInfo>
        {userFullName && <StyledUserName>{userFullName}</StyledUserName>}
        <StyledUserEmail>{currentWorkspaceMember.userEmail}</StyledUserEmail>
      </StyledUserInfo>
    </StyledContainer>
  );
};
