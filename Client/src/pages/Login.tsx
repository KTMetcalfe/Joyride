import { IonPage, IonItem, IonLabel, IonHeader, IonTitle, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonButtons, IonIcon, IonList } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useState } from "react";

import './Login.css'

const Login: React.FC = () => {
    const [user, setUser] = useState<string>();
    const [pswd, setPswd] = useState<string>();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class='ion-text-center'>Joyride</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="login-pane">
                    <IonGrid class="login-grid">
                        <IonRow>
                            <IonCol>
                                <IonTitle class='ion-text-center'>Login</IonTitle>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonList class='login-input'>
                                    <IonItem>
                                        <IonInput value={user} placeholder="Username" onIonChange={e => setUser(e.detail.value!)} />
                                    </IonItem>
                                    <IonItem>
                                        <IonInput value={pswd} placeholder="Password" onIonChange={e => setPswd(e.detail.value!)} />
                                    </IonItem>
                                </IonList>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block">
                                    <IonIcon slot='icon-only' icon={addCircleOutline} />
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Login;