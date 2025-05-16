import ContentSection from '../components/content-section';
import ProfileForm from './profile-form';

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Perfil'
      desc='Administra la configuración de tu perfil y preferencias de correo electrónico.'
    >
      <ProfileForm />
    </ContentSection>
  );
}
