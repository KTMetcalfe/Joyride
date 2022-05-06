import { IonButton, IonLabel, IonSpinner } from "@ionic/react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { curr_pswd, curr_user } from "../components/StorageService";

import './Modal.css';
import './PaymentForm.css';

// Payment form based off of Stripe API TypeScript documentation
const RentForm: React.FC<{ cid: string; pid: string; vehicle: any; onDismiss: () => void }> = ({ cid, pid, vehicle, onDismiss }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Runs on updates to Stripe API
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

  // Runs when user submits a payment
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: "https://joyride.kianm.net",
      },
      redirect: 'if_required'
    });

    if (setupIntent?.status === "succeeded") {
      setMessage("Success!");
      createRequest(typeof (setupIntent.payment_method) === 'string' ? setupIntent.payment_method : '')
        .then(onDismiss);
    }

    // Point reached if error in payment
    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message !== undefined ? error.message : '');
    } else if (!setupIntent) {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };

  // Creates a payment intent but does not charge the customer
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

  // React components
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