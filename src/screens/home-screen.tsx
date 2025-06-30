import { useTranslation } from "react-i18next";

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();

    return (
        <div>
            <h1>{t('home')}</h1>
        </div>
    );
}