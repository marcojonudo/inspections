package inspections.pogos.vehicles

import groovy.transform.TupleConstructor

@TupleConstructor
class Vehicle {

    VehicleType type
    String identifier
    String brand
    String model

}
