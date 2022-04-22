import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { curr_user, setCurrentAccount } from "../components/StorageService";
import { Elements } from "@stripe/react-stripe-js";

import './Modal.css';
import { loadStripe } from "@stripe/stripe-js";
import BuyForm from "./BuyForm";

const stripePromise = loadStripe("pk_test_51KrBMoHW1ixNikIwhzdtbDcW3nvQvtrSpv8rsBWPj7bsa19axEl35FvGoGCLzlpdRyMFnNbIoLRmER0XJHmiUUU700iykcFSkV");

const BuyPage: React.FC<{ vehicle: any; onDismiss: () => void; }> = ({ vehicle, onDismiss }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const body = { vehicle_id: vehicle.id, cents: vehicle.price * 100, seller: vehicle.user, buyer: curr_user };
    fetch('https://api.kianm.net/index.php/payment/buy', {
      method: 'post',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(e => e.json())
      .then(result => setClientSecret(result.clientSecret))
  }, []);

  const enum themeOptions {
    Stripe = 'stripe',
    Night = 'night',
    Flat = 'flat',
    None = 'none'
  };

  const appearance = {
    theme: themeOptions.Stripe,
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Buy</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={onDismiss}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false}>
        <div className="App">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Payment</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <BuyForm />
                </IonCardContent>
              </IonCard>
            </Elements>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default BuyPage;