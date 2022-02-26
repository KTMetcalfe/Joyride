import { IonPage, IonGrid, IonRow, IonCol, IonItem, IonLabel } from "@ionic/react";
import { curr_email, curr_priv, curr_pswd, curr_user } from "../components/StorageService";

const Structure: React.FC = () => {
    return (
        <IonPage>
            <IonGrid>
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