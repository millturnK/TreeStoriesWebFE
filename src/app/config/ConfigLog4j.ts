/**
 * Created by Katie Mills on 24/02/2017.
 * Log levels:
 Trace,
 Debug,
 Info,
 Warn,
 Error,
 Fatal
 */
import {LoggerFactory, LoggerFactoryOptions, LFService, LogGroupRule, LogLevel} from 'typescript-logging';

// Create options instance and specify 2 LogGroupRules:
// * One for any logger with a name starting with model, to log on debug
// * The second one for anything else to log on info
const options = new LoggerFactoryOptions()
    .addLogGroupRule(new LogGroupRule(new RegExp('model.+'), LogLevel.Debug))
    .addLogGroupRule(new LogGroupRule(new RegExp('service.+'), LogLevel.Debug))
    .addLogGroupRule(new LogGroupRule(new RegExp('component.GoogleMaps'), LogLevel.Debug))
    .addLogGroupRule(new LogGroupRule(new RegExp('component.+'), LogLevel.Debug))
    .addLogGroupRule(new LogGroupRule(new RegExp('.+'), LogLevel.Debug));

// Create a named loggerfactory and pass in the options and export the factory.
// Named is since version 0.2.+ (it's recommended for future usage)
export const loggerFactory = LFService.createNamedLoggerFactory('LoggerFactory', options);
