export interface Notifier {
  publish(msg: any, recipient: string, tag?: string): Promise<boolean>;
}
