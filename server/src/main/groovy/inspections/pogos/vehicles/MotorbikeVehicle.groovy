package inspections.pogos.vehicles

import groovy.transform.CompileStatic
import inspections.domains.fviberi.vehicle.Car

@CompileStatic
class MotorbikeVehicle extends Vehicle {

    String cylinder
    String engineCode
    String power
    Integer registrationYear

    MotorbikeVehicle(Car motorbike) {
        type = VehicleType.MOTORBIKE
        identifier = motorbike.numberPlate
        brand = motorbike.brand
        model = motorbike.model
        cylinder = motorbike.cylinder
        engineCode = motorbike.engineCode
        power = motorbike.power
        registrationYear = motorbike.registrationYear
    }

}
