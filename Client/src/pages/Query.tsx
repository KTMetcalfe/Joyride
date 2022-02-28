import { IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSpinner } from "@ionic/react"
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, setCurrentAccount, onLoad } from "../components/StorageService";

const Query: React.FC = () => {
    const [busy, setBusy] = useState(true);
    const [list, setList] = useState(Array<any>());

    useEffect(() => {
        fetch('https://api.kianm.net/index.php/vehicles/list', {
            method: 'GET',
            mode: 'cors'
        })
            .then(e => e.json())
            .then(result => {
                setList(result);
                setBusy(false);
            })
    })

    return busy ? <IonSpinner /> : (
        <IonPage>
            <IonContent>
                <IonList inset={true}>
                    <IonListHeader>
                        <IonLabel class='ion-text-center'>Vehicles</IonLabel>
                    </IonListHeader>
                    {list.map(v =>
                        <IonItem key={v.id}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol>Make:</IonCol>
                                    <IonCol>{v.make}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>Model:</IonCol>
                                    <IonCol>{v.model}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>Mileage:</IonCol>
                                    <IonCol>{v.mileage}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>Price:</IonCol>
                                    <IonCol>{v.price}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>Year:</IonCol>
                                    <IonCol>{v.model_year}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>Capacity:</IonCol>
                                    <IonCol>{v.capacity}</IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default Query;