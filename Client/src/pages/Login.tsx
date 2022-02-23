import { IonPage, IonItem, IonLabel, IonHeader, IonTitle, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonButtons, IonIcon, IonList } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { getCurrentUser, setCurrentUser } from "../components/StorageService";

import './Login.css'

const Login: React.FC = () => {
  const [user, setUser] = useState<string>();
  const [pswd, setPswd] = useState<string>();

  const verifyLogin = () => {
    fetch('https://api.kianm.net/index.php/login/verify', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(user + ':' + pswd)
      }
    })
      .then(e => e.json())
      .then(data => JSON.parse(data))
      .then(result => { if (result.isVerified == true) { setCurrentUser(user!) } })
      .then(() => { window.location.href = '/' })
  }

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
                <IonButton expand="block" onClick={() => user === undefined ? true : verifyLogin()}>
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