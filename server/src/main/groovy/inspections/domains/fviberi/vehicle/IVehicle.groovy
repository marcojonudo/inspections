package inspections.domains.fviberi.vehicle

import inspections.pogos.vehicles.Vehicle

interface IVehicle {

    Vehicle buildVehicle()

    enum Type {

        CAR,
        SCOOTER

    }

}
