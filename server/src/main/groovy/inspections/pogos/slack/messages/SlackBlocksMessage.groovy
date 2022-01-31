package inspections.pogos.slack.messages

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.pogos.slack.structure.blocks.SlackBlock

@CompileStatic
@TupleConstructor
class SlackBlocksMessage extends SlackMessage {

    List<SlackBlock> blocks

}
