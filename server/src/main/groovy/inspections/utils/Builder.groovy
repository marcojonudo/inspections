package inspections.utils

import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.domains.items.Item

@CompileStatic
class Builder {

	static Inspection buildInspection(Inspection inspection, Set<Item> items) {
		return new Inspection(inspection.code, inspection.name, items)
	}

}
