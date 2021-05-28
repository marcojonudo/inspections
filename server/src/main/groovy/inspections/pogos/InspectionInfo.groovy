package inspections.pogos


import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.domains.Inspection
import inspections.domains.SavedInspection

@TupleConstructor
@CompileStatic
class InspectionInfo {

	Inspection inspection
	SavedInspection savedInspection

}
