package inspections.pogos

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection

@TupleConstructor
@CompileStatic
class InspectionInfo {

	InspectionVehicle inspectionVehicle
	SavedInspection savedInspection

}
