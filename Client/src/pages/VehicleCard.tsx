import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react"
import { heart, heartOutline, removeCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { curr_priv, curr_pswd, curr_user, setRefreshQuery } from "../components/StorageService";

const VehicleCard: React.FC<{ id: number; onDismiss: () => void }> = ({ id, onDismiss }) => {
  const [vehicle, setVehicle] = useState<any>({});
  const [favorites, setFavorites] = useState<Array<any>>([]);
  const [update, setUpdate] = useState(false);

  const getFavorites = async () => {
    await fetch('https://api.kianm.net/index.php/account/favorites', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setFavorites(result)
      })
  }

  const addFavorite = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/account/addFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => setUpdate(true))
  }

  const removeFavorite = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/account/removeFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => setUpdate(true))
  }

  const removeVehicle = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/vehicles/remove', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":"' + $id + '"}'
    })
      .then(e => e.json())
      .then(result => {
        if (result.removed === true) {
          setUpdate(true);
        }
      })
  }

  const getVehicle = () => {
    if (curr_priv >= 2) {
      fetch('https://api.kianm.net/index.php/vehicles/get', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
          'Content-Type': 'application/json'
        },
        body: '{"id":' + id + '}'
      })
        .then(e => e.json())
        .then(result => {
          setVehicle(result[0]);
        })
    } else {
      fetch('https://api.kianm.net/index.php/vehicles/get', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"id":' + id + '}'
      })
        .then(e => e.json())
        .then(result => {
          setVehicle(result[0]);
        })
    }
  }

  useEffect(() => {
    if (curr_user !== '' && curr_pswd !== '') {
      getFavorites();
    }
    getVehicle();
    setUpdate(false);
    // eslint-disable-next-line
  }, [update])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Vehicle</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false}>
        {vehicle === undefined ?
          <IonCard>
            <IonCardHeader>
              <IonCardTitle class='ion-text-center'>Vehicle not found</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          :
          <IonCard key={vehicle.id}>
            <IonCardHeader>
              <IonCardSubtitle>Vehicle</IonCardSubtitle>
              <IonCardTitle>{vehicle.model_year} {vehicle.make} {vehicle.model}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
            <Swiper slidesPerView='auto'>
                {vehicle.images === undefined ? true : JSON.parse(vehicle.images).map((i: number) =>
                  <SwiperSlide key={i}>
                    <IonCard className='image-slider'>
                      <img alt={vehicle.id + '-' + i + '.jpg'} src={'https://api.kianm.net/files/vehicle_images/' + vehicle.id + '-' + i + '.jpg'} />
                    </IonCard>
                  </SwiperSlide>
                )}
              </Swiper>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonLabel>Price: </IonLabel>
                    <IonLabel>{vehicle.price}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>Mileage: </IonLabel>
                    <IonLabel>{vehicle.mileage}</IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonLabel>Capacity: </IonLabel>
                    <IonLabel>{vehicle.capacity}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>User: </IonLabel>
                    <IonLabel>{vehicle.user}</IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol />
                  <IonCol />
                  {curr_user !== '' ?
                    <IonCol>
                      <IonButtons class='center-buttons'>
                        <IonButton onClick={() => { favorites?.filter(e => e.id === vehicle.id).length === 1 ? removeFavorite(vehicle.id) : addFavorite(vehicle.id) }} size='small' fill='clear' color='primary'>
                          <IonIcon slot='icon-only' icon={favorites?.filter(e => e.id === vehicle.id).length === 1 ? heart : heartOutline} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    : false}
                  {curr_priv >= 1 ?
                    <IonCol>
                      <IonButtons class='center-buttons'>
                        <IonButton onClick={() => removeVehicle(vehicle.id)} size='small' fill='clear' color='danger'>
                          <IonIcon slot='icon-only' icon={removeCircleOutline} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    : false}
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        }
      </IonContent>
    </IonPage>
  );
}

export default VehicleCard;