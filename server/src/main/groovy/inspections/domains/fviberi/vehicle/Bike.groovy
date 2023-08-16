package inspections.domains.fviberi.vehicle

import grails.gorm.annotation.Entity
import inspections.pogos.vehicles.BikeVehicle
import inspections.pogos.vehicles.Vehicle
import inspections.pogos.vehicles.VehicleType
import inspections.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Bike implements GormEntity<Bike>, IVehicle {

    String serialNumber
    String brand
    String model
    String color

    static transients = ['type']

    static mapping = {
        datasource Constants.DataSource.FVIBERI
        table 'fvbicicleta'

        serialNumber column: 'nuserie'
        brand column: 'nomarca'
        model column: 'nomodelo'
        color column: 'color'

        version false
    }

    Vehicle buildVehicle() {
        return new BikeVehicle(VehicleType.E_BIKE, this.serialNumber, this.brand, this.model)
    }

}
