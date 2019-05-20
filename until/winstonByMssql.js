const util = require('util');
const winston = require('winston');
const sql = require('mssql');
const moment = require('moment');

/**
 * @constructs MSSQL
 * @param {Object} options
 * @api private
 */
var mssql = exports.mssql = function (options) {
    winston.Transport.call(this, options);

    options = options || {};

    this.name = 'mssql';
    this.connectionString = options.connectionString || 'mssql://username:password@localhost/database';
    this.table = options.table || 'dbo.NodeLogs';
}

/**
 * @extends winston.Transport
 */
util.inherits(mssql, winston.Transport);

/**
* Define a getter so that `winston.transports.SQLServer`
* is available and thus backwards compatible.
*/
winston.transports.mssql = mssql;

/**
 * Expose the name of this transport on the prototype
 */
mssql.prototype.name = 'mssql';

/**
 * Core Winston logging method
 *
 * @level {String} level to log at
 * @msg {String} message to log
 * @meta {object} metadata to attach to the messages
 * @callback {Function} callback to respond to when complete
 * @api public
 */
mssql.prototype.log = function (pLevel, pData, meta, callback) {
    var self = this;
    	data = typeof pData == "string" ? JSON.parse(pData) : {},
    	regex = new RegExp("'","gi");

    return sql.connect(this.connectionString).then(function (connection) {
        var currentDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        var query = "INSERT INTO " + self.table + " (SDL_DATETIME, SDL_LEVEL, SDL_USER, SDL_MESSAGE, SDL_SQL, SDL_IP) VALUES " +
            "('" + currentDate + "', '" + 
                   (pLevel || '') + "', '" + 
                   (data.User || '') + "', '" + 
                   (data.Msg.replace(regex, "''") || '') + "', '" + 
                   (data.Sql.replace(regex, "''") || '') + "', '" + 
                   (data.IP || '') + 
            "')";

        var request = new sql.Request();

        return request.query(query).then(function (err, recordset) {
        		// console.log(err, recordset);
                // connection.close();
            })
            .catch(function (error) {
                // connection.close();
                // throw error;
            });
    })
    .catch(function (error) {
        // console.error("DB write logs error:", error);
    })
};