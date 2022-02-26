import { IonPage, IonGrid, IonRow, IonCol, IonItem, IonLabel, useIonModal, IonButton, IonIcon } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useRef } from "react";
import { curr_email, curr_priv, curr_pswd, curr_user } from "../components/StorageService";
import Login from "./Login";
import Main from "./Main";
import Signup from "./Signup";

const Structure: React.FC<{ pageRef: any }> = ({ pageRef }) => {
    const handlePresentLogin = () => {
        presentLogin({
            mode: 'ios',
            swipeToClose: true,
            presentingElement: pageRef.current
        })
    };

    const handleDismissLogin = () => {
        dismissLogin();
    };

    const [presentLogin, dismissLogin] = useIonModal(Login, {
        onDismiss: handleDismissLogin
    })

    const handlePresentSignup = () => {
        presentSignup({
            mode: 'ios',
            swipeToClose: true,
            presentingElement: pageRef.current
        })
    };

    const handleDismissSignup = () => {
        dismissSignup();
    };

    const [presentSignup, dismissSignup] = useIonModal(Signup, {
        onDismiss: handleDismissSignup,
        onClose: handleDismissSignup
    })

    return (
        <IonPage>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonButton onClick={handlePresentLogin} expand='block'>
                            Login
                        </IonButton>
                    </IonCol>
                    <IonCol>
                        <IonButton onClick={handlePresentSignup} expand='block'>
                            Signup
                        </IonButton>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel>Email: {curr_email}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>User: {curr_user}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Password: {curr_pswd}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Priveledge: {curr_priv}</IonLabel>
                        </IonItem>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    )
}

export default Structure;