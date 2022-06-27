package inspections.tasks

import groovy.transform.CompileStatic
import inspections.services.InspectionService
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.scheduling.annotation.Scheduled

import javax.inject.Inject
import javax.inject.Singleton

@CompileStatic
@Singleton
@Requires(notEnv = Environment.TEST)
class TextItemValuesTask {

	@Inject InspectionService inspectionService

	@Scheduled(cron = "\${cron.text-values}")
	void execute() {
		inspectionService.updateTextValues()
	}

}
