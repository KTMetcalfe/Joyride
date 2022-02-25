import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonButtons, useIonModal } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import { setCurrentAccount } from "../components/StorageService";

import './Login.css';
import Signup from "./Signup";

const Login: React.FC<{ onDismiss: () => void; }> = ({ onDismiss }) => {
  const handlePresentSignup = () => {
    presentSignup({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: pageRef.current
    })
  };
  
  const handleCloseSignup = () => {
    dismissSignup();
  }

  const handleDismissSignup = () => {
    dismissSignup();
    onDismiss();
  };

  const [presentSignup, dismissSignup] = useIonModal(Signup, {
    onDismiss: handleDismissSignup,
    onClose: handleCloseSignup
  })

  const [user, setUser] = useState<string>('');
  const [pswd, setPswd] = useState<string>('');

  const pageRef = useRef();

  const validateLogin = () => {
    window.document.getElementById('login-output')!.style.display = "none";
    window.document.getElementById('loginErr')!.innerHTML = "";

    fetch('https://api.kianm.net/index.php/login/validate', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(user + ':' + pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        if (result.isVerified === true) {
          setCurrentAccount(result.email!, user!, pswd!);
          window.document.getElementById('loginErr')!.innerHTML = "Logged in";
          window.document.getElementById('login-output')!.style.display = "block";
          onDismiss();
        } else {
          window.document.getElementById('loginErr')!.innerHTML = "Username or password incorrect";
          window.document.getElementById('login-output')!.style.display = "block";
        }
      })
  }

  return (
    <IonPage ref={pageRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Login</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="login-pane">
          <IonGrid class="login-grid">
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
                <IonItem id='login-output'>
                  <IonLabel id='loginErr' class='ion-text-center'></IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton expand="block" onClick={() => {
                  if (user !== '' && pswd !== '') {
                    validateLogin()
                  } else {
                    window.document.getElementById('login-output')!.style.display = "block";
                    window.document.getElementById('loginErr')!.innerHTML = "Please enter all information";
                  }
                }}>
                  <IonIcon slot='icon-only' icon={addCircleOutline} />
                </IonButton>
                <IonButtons>
                  <IonButton onClick={handlePresentSignup}>Signup</IonButton>
                </IonButtons>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login;