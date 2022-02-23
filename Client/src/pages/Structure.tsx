import { IonPage, IonGrid, IonRow, IonCol, IonItem, IonLabel } from "@ionic/react";

const Structure: React.FC = () => {
    return (
        <IonPage>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel>Table:</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Database:</IonLabel>
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