
import {
  factory,
  visitNode,
  visitEachChild,
  Transformer,
  TransformerFactory,
  TransformationContext,
  Node,
  isCallExpression,
  isIdentifier,
  Program,
  SourceFile
} from 'typescript'
import { JsonSchemaGenerator, Args } from './JsonSchemaGenerator'

export interface TransformerOptions {
  placeholder?: string; // 校验函数的名字
  args?: Args;
}

const defaultOptions: TransformerOptions = {
  placeholder: 'trvalidate'
}

export function createTransformer(program: Program, options?: TransformerOptions): TransformerFactory<SourceFile> {
  const opt = { ...defaultOptions, ...(options || {}) }
  const checker = program.getTypeChecker()
  const generator = new JsonSchemaGenerator(checker, opt.args)
  return (context: TransformationContext): Transformer<SourceFile> => {
    return (node: SourceFile) => visitNode(node, visit)

    function visit(node: Node) {
        if (
          isCallExpression(node) &&
          isIdentifier(node.expression) &&
          node.expression.escapedText === opt.placeholder
        ) {
          if (!node.arguments || !node.typeArguments) {
            return visitEachChild(node, visit, context)
          }
          const type = checker.getTypeFromTypeNode(node.typeArguments[0])
          const ss = generator.getSchemaForType(type)
          // return factory.add
          return factory.createCallExpression(
            node.expression,
            [],
            [...node.arguments, factory.createIdentifier(JSON.stringify(ss))]
          )
        }
        // 其它节点保持不变
        return visitEachChild(node, visit, context)
    }
  }
}
