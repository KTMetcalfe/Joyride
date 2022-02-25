import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonButton, IonIcon, IonLabel } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { setCurrentAccount } from "../components/StorageService";

import './Login.css';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [pswd, setPswd] = useState<string>('');

  const checkSignup = () => {
    window.document.getElementById('signup-output')!.style.display = "none";
    window.document.getElementById('signupErr')!.innerHTML = "";

    fetch('https://api.kianm.net/index.php/signup', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(user + ':' + pswd),
        'Content-Type': 'application/json'
      },
      body: '{"email":"' + email + '"}'
    })
      .then(e => e.json())
      .then(result => {
        if (result.signedUp === true) {
          setCurrentAccount(email!, user!, pswd!);
          window.document.getElementById('signupErr')!.innerHTML = "Signed up";
          window.document.getElementById('signup-output')!.style.display = "block";
        } else if (result.error === "username_taken") {
          window.document.getElementById('signupErr')!.innerHTML = "Username taken";
          window.document.getElementById('signup-output')!.style.display = "block";
        }
      })
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
                <IonList class='login-input'>
                  <IonItem>
                    <IonInput value={email} placeholder="Email" onIonChange={e => setEmail(e.detail.value!)} />
                  </IonItem>
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
                <IonItem id='signup-output'>
                  <IonLabel id='signupErr' class='ion-text-center'></IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton expand="block" onClick={() => {
                  if (email !== '' && user !== '' && pswd !== '') {
                    checkSignup()
                  } else {
                    window.document.getElementById('signup-output')!.style.display = "block";
                    window.document.getElementById('signupErr')!.innerHTML = "Please enter all information";
                  }
                }}>
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

export default Signup;