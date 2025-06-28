import { useTranslation } from "react-i18next";

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div>{t('home')}</div>
    );
}