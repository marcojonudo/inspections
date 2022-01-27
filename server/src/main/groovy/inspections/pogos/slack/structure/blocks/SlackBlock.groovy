package inspections.pogos.slack.structure.blocks


import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.pogos.slack.structure.elements.SlackBaseElem

@CompileStatic
@TupleConstructor(includeSuperProperties = true, callSuper = true)
class SlackBlock extends SlackBaseElem {

    SlackBaseElem accessory

}
