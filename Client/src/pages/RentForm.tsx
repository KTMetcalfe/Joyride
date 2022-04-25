import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonSpinner } from "@ionic/react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { curr_pswd, curr_user } from "../components/StorageService";

import './Modal.css';
import './PaymentForm.css';

const RentForm: React.FC<{ cid: string; pid: string; vehicle: any; onDismiss: () => void }> = ({ cid, pid, vehicle, onDismiss }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe])

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:8100",
      },
      redirect: 'if_required'
    });

    if (setupIntent?.status === "succeeded") {
      setMessage("Success!");
      createRequest(typeof (setupIntent.payment_method) === 'string' ? setupIntent.payment_method : '')
        .then(onDismiss);
    }

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message !== undefined ? error.message : '');
    } else if (!setupIntent) {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };

  const createRequest = async (card: string) => {
    const body = { customer_id: cid, payment_id: card, vehicle_id: vehicle.id, request_type: 'Rent', price: vehicle.rent_price * 100, buyer: curr_user, seller: vehicle.user };
    await fetch("https://api.kianm.net/index.php/payment/request", {
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    console.log(body);
  }

  return (
    <form className="center" id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <IonButton disabled={isLoading || !stripe || !elements} id="submit" type="submit">
        {isLoading ?
          <IonSpinner />
          :
          <IonLabel>Rent for ${Number(vehicle.rent_price).toLocaleString('en-US')}</IonLabel>
        }
      </IonButton>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

export default RentForm;