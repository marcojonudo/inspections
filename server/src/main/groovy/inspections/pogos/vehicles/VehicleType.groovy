package inspections.pogos.vehicles

import inspections.domains.fviberi.vehicle.IVehicle
import inspections.services.data.fviberi.OrderDataService

enum VehicleType {

    E_BIKE(
        "BICICLETA",
        { OrderDataService dataService, String id -> dataService.bikeDataService.find(id) }
    ),
    CAR(
        "COCHE",
        { OrderDataService dataService, String id -> dataService.carDataService.find(id) }
    ),
    MOTORBIKE(
        "MOTO",
        { OrderDataService dataService, String id -> dataService.carDataService.find(id) }
    ),
    E_SCOOTER(
        "PATINETE",
        { OrderDataService dataService, String id -> dataService.scooterDataService.find(id) }
    ),

    final String type
    final Closure<IVehicle> find

    VehicleType(String type, Closure<IVehicle> find) {
        this.type = type
        this.find = find
    }

}
