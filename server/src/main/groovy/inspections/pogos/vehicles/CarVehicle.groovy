package inspections.pogos.vehicles

import groovy.transform.CompileStatic
import inspections.domains.fviberi.vehicle.Car

@CompileStatic
class CarVehicle extends Vehicle {

    String cylinder
    String engineCode
    String power
    Integer registrationYear

    CarVehicle(Car car) {
        type = VehicleType.CAR
        identifier = car.numberPlate
        brand = car.brand
        model = car.model
        cylinder = car.cylinder
        engineCode = car.engineCode
        power = car.power
        registrationYear = car.registrationYear
    }

}
