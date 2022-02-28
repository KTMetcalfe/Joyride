import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonButtons } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { setCurrentAccount } from "../components/StorageService";

import './Modal.css';

const Signup: React.FC<{ onDismiss: () => void; onClose: () => void; userInput: string; pswdInput: string; }> = ({ onDismiss, onClose, userInput, pswdInput }) => {
  const [email, setEmail] = useState<string>('');
  const [user, setUser] = useState<string>(userInput === undefined ? '' : userInput);
  const [pswd, setPswd] = useState<string>(pswdInput === undefined ? '' : pswdInput);

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
          setCurrentAccount(email!, user!, pswd!, 0);
          window.document.getElementById('signupErr')!.innerHTML = "Signed up";
          window.document.getElementById('signup-output')!.style.display = "block";
          onDismiss();
          window.location.reload();
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
          <IonTitle class='ion-text-center'>Signup</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="form-pane">
          <IonGrid class="form-grid">
            <IonRow>
              <IonCol>
                <IonList class='form-input'>
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
                <IonButton color="secondary" expand="block" onClick={() => {
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