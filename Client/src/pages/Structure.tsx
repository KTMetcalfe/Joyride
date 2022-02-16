import { IonPage, IonGrid, IonRow, IonCol, IonItem, IonLabel } from "@ionic/react";
import { getCurrDatabase, getCurrTable } from "../components/vars";

const Structure: React.FC = () => {
    return (
        <IonPage>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel>Table: {getCurrTable().name !== '' ? getCurrTable().name : false}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Database: {getCurrDatabase().name !== '' ? getCurrDatabase().name : false}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Test</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Test</IonLabel>
                        </IonItem>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    )
}

export default Structure;