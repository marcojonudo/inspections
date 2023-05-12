package inspections.domains.fviberi.vehicle

import grails.gorm.annotation.Entity
import inspections.pogos.vehicles.ScooterVehicle
import inspections.pogos.vehicles.Vehicle
import inspections.pogos.vehicles.VehicleType
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Scooter implements GormEntity<Scooter>, IVehicle {

    String serialNumber
    String brand
    String model
    String color

    static transients = ['type']

    static mapping = {
        datasource Constants.DataSource.FVIBERI
        table 'fvpatinete'

        serialNumber column: 'nuserie'
        brand column: 'nomarca'
        model column: 'nomodelo'
        color column: 'color'

        version false
    }

    Vehicle buildVehicle() {
        return new ScooterVehicle(VehicleType.E_SCOOTER, this.serialNumber, this.brand, this.model)
    }

}
