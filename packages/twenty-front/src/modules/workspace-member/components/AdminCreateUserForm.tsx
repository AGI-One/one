import { TextInput } from '@/ui/input/components/TextInput';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useAdminCreateUser } from '@/workspace-member/hooks/useAdminCreateUser';
import styled from '@emotion/styled';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLingui } from '@lingui/react/macro';
import { useCallback } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { H2Title } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { z } from 'zod';

const ADMIN_CREATE_USER_MODAL_ID = 'admin-create-user-modal';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledFieldGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledModalContent = styled(Modal.Content)`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(6)}
    ${({ theme }) => theme.spacing(4)};
`;

const StyledModalFooter = styled(Modal.Footer)`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)}
    ${({ theme }) => theme.spacing(6)};
`;

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  locale?: string;
};

export const AdminCreateUserForm = () => {
  const { t } = useLingui();

  const validationSchema = z
    .object({
      email: z.string().email({
        message: t`Invalid email address`,
      }),
      firstName: z.string().min(1, {
        message: t`First name is required`,
      }),
      lastName: z.string().min(1, {
        message: t`Last name is required`,
      }),
      password: z.string().min(8, {
        message: t`Password must be at least 8 characters`,
      }),
      locale: z.string().optional(),
    })
    .required();
  const { closeModal } = useModal();
  const { adminCreateUser, loading } = useAdminCreateUser();

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      locale: 'en',
    },
    resolver: zodResolver(validationSchema),
  });

  const handleClose = useCallback(() => {
    reset();
    closeModal(ADMIN_CREATE_USER_MODAL_ID);
  }, [reset, closeModal]);

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (data) => {
      try {
        await adminCreateUser({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
          locale: data.locale || 'en',
        });
        handleClose();
        // The useAdminCreateUser hook handles success feedback
        // Parent component should refetch data on modal close
      } catch (error) {
        // Error handling is done in the hook
        console.error(t`Failed to create user:`, error);
      }
    },
    [adminCreateUser, handleClose],
  );

  return (
    <Modal
      modalId={ADMIN_CREATE_USER_MODAL_ID}
      isClosable={true}
      onClose={handleClose}
      size="medium"
      padding="none"
    >
      <Modal.Header>
        <H2Title
          title={t`Add New User`}
          description={t`Create a new user account with email and password. The user will be able to log in immediately after creation.`}
        />
      </Modal.Header>
      <StyledModalContent>
        <StyledFormContainer>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={t`Email`}
                placeholder={t`Enter user email`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                fullWidth
                autoFocus
              />
            )}
          />

          <StyledFieldGroup>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t`First Name`}
                  placeholder={t`Enter first name`}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t`Last Name`}
                  placeholder={t`Enter last name`}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                  fullWidth
                />
              )}
            />
          </StyledFieldGroup>

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={t`Password`}
                placeholder={t`Enter temporary password`}
                type="password"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                fullWidth
              />
            )}
          />
        </StyledFormContainer>
      </StyledModalContent>
      <StyledModalFooter>
        <StyledButtonContainer>
          <Button
            variant="secondary"
            title={t`Cancel`}
            onClick={handleClose}
            disabled={loading}
          />
          <Button
            variant="primary"
            title={t`Create User`}
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || loading}
            isLoading={loading}
          />
        </StyledButtonContainer>
      </StyledModalFooter>
    </Modal>
  );
};
