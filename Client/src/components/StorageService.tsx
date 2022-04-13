import { Storage, StoragePlugin } from '@capacitor/storage';

const storage: StoragePlugin = Storage;

export var refreshQuery: boolean = false;
export const setRefreshQuery = (value: boolean) => {
  refreshQuery = value;
}

// 
export const powertrainOptions = [
  { type: 'Gas', isChecked: false },
  { type: 'Electric', isChecked: false },
  { type: 'Hybrid', isChecked: false },
  { type: 'Hydrogen', isChecked: false }
];
// 
export const vehicleTypeOptions = [
  { type: 'Truck', isChecked: false },
  { type: 'Semi', isChecked: false },
  { type: 'Coupe', isChecked: false },
  { type: 'Van', isChecked: false },
  { type: 'Sedan', isChecked: false },
  { type: 'SUV', isChecked: false },
  { type: 'Hatchback', isChecked: false },
  { type: 'Crossover', isChecked: false },
  { type: 'Compact', isChecked: false }
];
// 
export const vehicleOptionOptions = [
  { type: 'A/C', isChecked: false },
  { type: 'Sunroof', isChecked: false },
  { type: 'Heated Seats', isChecked: false },
  { type: 'Cooled Seats', isChecked: false },
  { type: 'Moonroof', isChecked: false },
  { type: 'Automatic Windows', isChecked: false },
  { type: 'Powered Seats', isChecked: false },
  { type: 'Carplay', isChecked: false },
  { type: 'Android Auto', isChecked: false },
  { type: 'Remote Start', isChecked: false },
  { type: 'Keyless Entry', isChecked: false },
];

// Filter limits
export const yearMin = 1900;
export const yearMax = new Date().getFullYear() + 2;
export const capacityMin = 1;
export const capacityMax = 7;

export const baseFilter: object = {
  "year_start": null,
  "year_end": null,
  "price_start": null,
  "price_end": null,
  "capacity_start": null,
  "capacity_end": null,
  "mileage_start": null,
  "mileage_end": null,
  "transmission_type": null,
  "vehicle_color": null,
  "make": null,
  "model": null,
  "rating_start": null,
  "powertrains_list": null,
  "vehicle_types_list": null,
  "vehicle_options_list": null
}
export var filter = baseFilter;
export const setFilter = (value: object) => {
  filter = value;
}
export var resetQuery: boolean = false;
export const setResetQuery = (value: boolean) => {
  resetQuery = value;
}

export var curr_email: string = '';
export var curr_user: string = '';
export var curr_pswd: string = '';
export var curr_priv: number = 0;

export const setCurrentAccount = async (email: string, user: string, pswd: string, priv: number) => {
  await storage.set({
    key: 'account',
    value: JSON.stringify('{"email":"' + email + '","user":"' + user + '","pswd":"' + pswd + '","priv":"' + priv + '"}')
  });
  curr_email = email;
  curr_user = user;
  curr_pswd = pswd;
  curr_priv = priv;
  return getCurrentAccount();
}

export const getCurrentAccount = async () => {
  const { value } = await storage.get({ key: 'account' });
  let account = JSON.parse(value as string);
  return account;
}

export const onLoad = async () => {
  try {
    console.log("Checking user...");

    const { value } = await storage.get({ key: 'account' });

    let acc = JSON.parse(value as string);
    let account = JSON.parse(acc);

    if (account === null) {
      throw new Error("No account in storage")
    }

    await fetch('https://api.kianm.net/index.php/login/validate', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(account.user + ':' + account.pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        if (result.isVerified === true) {
          curr_email = result.email;
          curr_user = account.user;
          curr_pswd = account.pswd;
          curr_priv = result.priveledge;
          console.log("User validated");
        } else {
          console.log("Mismatch between local and remote user");
        }
      })

  } catch (e) {
    console.error(e);
  }
}

export const clearStorage = async () => {
  storage.clear();
}