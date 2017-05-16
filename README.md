# Course Work for Pluralsight Course "Advanced Node.js"

https://www.pluralsight.com/courses/nodejs-advanced

# Code Examples

Code examples can be found at https://github.com/jscomplete/advanced-nodejs.

# Node's Architecture: V8 and libuv

Node VMs
* V8
* Chakra

The JavaScript features supported by Node are really the JavaScript features supported by the V8 JavaScript engine.

V8 Feature Groups are either 'Shipping', 'Staged' or 'In Progress'.

'Shipping' features are on by default, whereas 'Staged' and 'In Progress' features are not as they are not sometimes not complete. 

Use the `--harmony` flag to use 'Staged' features that are not currently enabled.

    $ node --version
    v7.10.0

    $ node -p 'process.versions.v8'
    5.5.372.43

    $ node -p "'Node'.padEnd(8, '*')"
    [eval]:1
    'Node'.padEnd(8, '*')
          ^

    TypeError: "Node".padEnd is not a function
        at [eval]:1:8
        at ContextifyScript.Script.runInThisContext (vm.js:23:33)
        at Object.runInThisContext (vm.js:95:38)
        at Object.<anonymous> ([eval]-wrapper:6:22)
        at Module._compile (module.js:571:32)
        at evalScript (bootstrap_node.js:391:27)
        at run (bootstrap_node.js:124:11)
        at run (bootstrap_node.js:427:7)
        at startup (bootstrap_node.js:123:9)
        at bootstrap_node.js:542:3

    $ node --harmony -p "'Node'.padEnd(8, '*')"
    Node****

To get the list of "In Progress" features, use this command:

    $ node --v8-options | grep "in progress"
      --harmony_array_prototype_values (enable "harmony Array.prototype.values" (in progress))
      --harmony_function_sent (enable "harmony function.sent" (in progress))
      --harmony_sharedarraybuffer (enable "harmony sharedarraybuffer" (in progress))
      --harmony_simd (enable "harmony simd" (in progress))
      --harmony_do_expressions (enable "harmony do-expressions" (in progress))
      --harmony_restrictive_generators (enable "harmony restrictions on generator declarations" (in progress))
      --harmony_regexp_named_captures (enable "harmony regexp named captures" (in progress))
      --harmony_regexp_property (enable "harmony unicode regexp property classes" (in progress))
      --harmony_for_in (enable "harmony for-in syntax" (in progress))
      --harmony_trailing_commas (enable "harmony trailing commas in function parameter lists" (in progress))
      --harmony_class_fields (enable "harmony public fields in class literals" (in progress))

For example, to use the --harmony_trailing_commas feature:

    $ node -p 'function tc(a,b,) {}'
    [eval]:1
    function tc(a,b,) {}
                    ^
    SyntaxError: Unexpected token )
        at createScript (vm.js:53:10)
        at Object.runInThisContext (vm.js:95:10)
        at Object.<anonymous> ([eval]-wrapper:6:22)
        at Module._compile (module.js:571:32)
        at evalScript (bootstrap_node.js:391:27)
        at run (bootstrap_node.js:124:11)
        at run (bootstrap_node.js:427:7)
        at startup (bootstrap_node.js:123:9)
        at bootstrap_node.js:542:3

    $ node --harmony_trailing_commas -p 'function tc(a,b,) {}'
    undefined

To view all V8 options:

    $ node --v8-options | less

    SSE3=1 SSSE3=1 SSE4_1=1 SAHF=1 AVX=1 FMA3=0 BMI1=0 BMI2=0 LZCNT=0 POPCNT=1 ATOM=0
    Usage:
      shell [options] -e string
        execute string in V8
      shell [options] file1 file2 ... filek
        run JavaScript scripts in file1, file2, ..., filek
      shell [options]
      shell [options] --shell [file1 file2 ... filek]
        run an interactive JavaScript shell
      d8 [options] file1 file2 ... filek
      d8 [options]
      d8 [options] --shell [file1 file2 ... filek]
        run the new debugging shell

    Options:
      --experimental_extras (enable code compiled in via v8_experimental_extra_library_files)
            type: bool  default: false
      --use_strict (enforce strict mode)
            type: bool  default: false
      --es_staging (enable test-worthy harmony features (for internal use only))
            type: bool  default: false
      --harmony (enable all completed harmony features)
            type: bool  default: false
      --harmony_shipping (enable all shipped harmony features)
            type: bool  default: true
      --harmony_array_prototype_values (enable "harmony Array.prototype.values" (in progress))
            type: bool  default: false
      .
      .
      .

Use `grep` to search for specific options (example shown is for the garbage collector):

    $ node --v8-options | grep gc
      --expose_gc (expose gc extension)
      --expose_gc_as (expose gc extension under the specified name)
      --gc_global (always perform global GCs)
      --gc_interval (garbage collect after <n> allocations)
      --retain_maps_for_n_gc (keeps maps alive for <n> old space garbage collections)
      --trace_gc (print one trace line following each garbage collection)
      --trace_gc_nvp (print one detailed trace line in name=value format after each garbage collection)
      --trace_gc_ignore_scavenger (do not print trace line after scavenger collection)
      --trace_gc_verbose (print more details following each garbage collection)
      --trace_mutator_utilization (print mutator utilization, allocation speed, gc speed)
      --track_gc_object_stats (track object counts and memory usage)
      --trace_gc_object_stats (trace object counts and memory usage)
      --cleanup_code_caches_at_gc (Flush inline caches prior to mark compact collection and flush code caches in maps during mark compact cycle.)
      --log_gc (Log heap samples on garbage collection for the hp2ps tool.)
      --gc_fake_mmap (Specify the name of the file for fake gc mmap used in ll_prof)
            type: string  default: /tmp/__v8_gc__

V8 methods you can call at runtime:

    $ node
    
    > v8
    { getHeapStatistics: [Function],
      setFlagsFromString: [Function: setFlagsFromString],
      getHeapSpaceStatistics: [Function] }
    
    > v8.getHeapStatistics()
    { total_heap_size: 7258112,
      total_heap_size_executable: 3670016,
      total_physical_size: 6205800,
      total_available_size: 1491617536,
      used_heap_size: 4484248,
      heap_size_limit: 1501560832,
      malloced_memory: 8192,
      peak_malloced_memory: 1174288,
      does_zap_garbage: 0 }

    > v8.getHeapSpaceStatistics()
    [ { space_name: 'new_space',
        space_size: 2097152,
        space_used_size: 604576,
        space_available_size: 426592,
        physical_space_size: 2066992 },
      { space_name: 'old_space',
        space_size: 2985984,
        space_used_size: 2761624,
        space_available_size: 192,
        physical_space_size: 2813848 },
      { space_name: 'code_space',
        space_size: 1630208,
        space_used_size: 1340896,
        space_available_size: 352,
        physical_space_size: 1406432 },
      { space_name: 'map_space',
        space_size: 544768,
        space_used_size: 260216,
        space_available_size: 0,
        physical_space_size: 277624 },
      { space_name: 'large_object_space',
        space_size: 0,
        space_used_size: 0,
        space_available_size: 1491066368,
        physical_space_size: 0 } ]

Node is more than a wrapper for V8:

    ----------------------------------
    |           Your Code            |
    ----------------------------------
    |      |     Core Modules        |
    |      |--------------------------
    |  V8  |     C++ Bindings        |
    |      |--------------------------
    |      | libuv | c-ares, http, ..|
    ----------------------------------
    |      The Operating System      |
    ----------------------------------

Node
* provides APIs for working with the operating system files, binary data, networking and more
* uses V8 via V8's C++ API
* has an API you can call via JavaScript allowing us to interact with the file system, network, timers and other things
* eventually executes C++ code using V8 object and function templates
* handles awaiting for async events using `libuv`
* will pass control over to the V8 engine after a callback completes
* will receive control back from the V8 engine after the callback function finishes execution
* will wait on V8, since it is single-threaded
* dependencies
  * `libuv`
    * is used to abstract the non-blocking IO operations
    * provides a consistent interface for file system interaction, TCP/UDP sockets, child processes and others
    * has a thread pool to handle what can't be done asynchronously at the operating system level
    * provides Node with the event loop
  * http-parser
    * library to parse http messages (requests and responses)
  * c-ares
    * performs asynchronous DNS queries
  * OpenSSL
    * used mostly in the TLS and crypto modules
    * provides implementations for many cryptographic functions
  * zlib
    * used for fast, async and streaming compression and decompression interfaces

# Node's CLI and REPL

## REPL

Running the `node` command starts a `REPL` (Read, Eval, Print, Loop). 

One of the most useful features of the Node REPL is autocomplete. 

Another helpful feature is the underscore (`_`). Use it to capture the last evaluated value.

    > Math.random()
    0.020851704171037655
    > let r = _;
    undefined
    > r
    0.020851704171037655

The REPL has built-in special commands that all start with a dot:

    > .
    break   clear   editor  exit    help    load    save

    > .help
    .break    Sometimes you get stuck, this gets you out
    .clear    Alias for .break
    .editor   Enter editor mode
    .exit     Exit the repl
    .help     Print this help message
    .load     Load JS from a file into the REPL session
    .save     Save all evaluated commands in this REPL session to a file

Node has a built-in REPL module that can be used within code to start a custom REPL session with many options available.

    const repl = require('repl');

    repl.start({
      ignoreUndefined: true,
      replMode: repl.REPL_MODE_STRICT
    });

## CLI

    $ node --help | less

    Usage: node [options] [ -e script | script.js ] [arguments]
       node debug script.js [arguments]

    Options:
      -v, --version              print Node.js version
      -e, --eval script          evaluate script
      -p, --print                evaluate script and print result
      -c, --check                syntax check script without executing
      -i, --interactive          always enter the REPL even if stdin
                                does not appear to be a terminal
      -r, --require              module to preload (option can be repeated)
      --inspect[=[host:]port]    activate inspector on host:port
                                (default: 127.0.0.1:9229)
      --inspect-brk[=[host:]port]
                                activate inspector on host:port
                                and break at start of user script
      --no-deprecation           silence deprecation warnings
      --trace-deprecation        show stack traces on deprecations
      --throw-deprecation        throw an exception on deprecations
      --no-warnings              silence all process warnings
      --trace-warnings           show stack traces on process warnings
      --trace-sync-io            show stack trace when use of sync IO
                                is detected after the first tick
      --trace-events-enabled     track trace events
      --trace-event-categories   comma separated list of trace event
                                categories to record
      --track-heap-objects       track heap object allocations for heap snapshots
      --prof-process             process v8 profiler output generated
                                using --prof
      --zero-fill-buffers        automatically zero-fill all newly allocated
                                Buffer and SlowBuffer instances
      --v8-options               print v8 command line options
      --v8-pool-size=num         set v8's thread pool size
      --tls-cipher-list=val      use an alternative default TLS cipher list
      --use-bundled-ca           use bundled CA store (default)
      --use-openssl-ca           use OpenSSL's default CA store
      --openssl-config=file      load OpenSSL configuration from the
                                specified file (overrides
                                OPENSSL_CONF)
      --icu-data-dir=dir         set ICU data load path to dir
                                (overrides NODE_ICU_DATA)
      --preserve-symlinks        preserve symbolic links when resolving
                                and caching modules

    Environment variables:  ...

### process.argv

Use the process.argv to obtain access to the arguments passed to the node command. Note that the first argument in the array is the command. Also note that all arguments are passed as strings.

    $ node -p "process.argv.slice(1)" test 42
    [ 'test', '42' ]

# Global Object, Process and Buffer

## Global Object

The `global` object has many properties. The two most important objects are the `process` object and the `buffer` object.

    > console.log(global);
    { DTRACE_NET_SERVER_CONNECTION: [Function],
      DTRACE_NET_STREAM_END: [Function],
      DTRACE_HTTP_SERVER_REQUEST: [Function],
      DTRACE_HTTP_SERVER_RESPONSE: [Function],
      DTRACE_HTTP_CLIENT_REQUEST: [Function],
      DTRACE_HTTP_CLIENT_RESPONSE: [Function],
      global: [Circular],
      process:
      process {
        title: 'node',
        version: 'v7.10.0',
        moduleLoadList:
      ...
      Buffer:
      { [Function: Buffer]
        poolSize: 8192,
        from: [Function],
        alloc: [Function],
        allocUnsafe: [Function],
        allocUnsafeSlow: [Function],
        isBuffer: [Function: isBuffer],
        compare: [Function: compare],
        isEncoding: [Function],
        concat: [Function],
        byteLength: [Function: byteLength] },
      ...

## Process

The Node `process` object provides a bridge between the Node application and its runtime environment. The `process` object has many properties on it. One of the most useful is the `process.env` property.

    > process.env
    (output omitted)

The `process.env` object holds a copy of the values (not the values themselves). It is recommended that you do not read from `process.env` directly. Encapsulate the values inside a config module instead.

    // in index.js

    const { config } from require('./util');

    var port = config.port;

    // in util.js

    export const config = {
      port: process.env.PORT || 8080
    };

Use `process.release.lts` to determine if the Node version is an LTS version. If the resulting value is `undefined`, then the version is NOT an LTS version.

    $ node --version
    v7.10.0

    $ node
    > process.release.lts
    undefined

The process object is an instance of event emitter. 

One handy event is the `onExit` event. Emitted by Node when the process has nothing else to do or when a manual call to `process.exit` has been executed.

    process.on('exit', (code) => {
      // do one final synchronous operation before the Node process terminates
      // you can't use the event loop here, only synchronous operations are allowed
    });

Another useful event is the `onUncaughtException` event, which is emitted when an uncaught exception bubbles up to top of the event loop. By default, NOde will print out the stack trace and exit. Don't prevent Node from exiting. The runtime may be in an unpredictable state.

    process.on('uncaughtException', (err) => {
      // something went uncaught
      // do any cleanup tasks and exit
    });

## Buffer

The buffer class is used to work with binary streams of data. It is a chunk of memory outside the V8 heap. Anything placed in a buffer needs to have a character encoding specified. Once a buffer is allocated, it cannot be resized.

    $ node
    > Buffer.alloc(8)               // create a buffer and fill with defaults
    <Buffer 00 00 00 00 00 00 00 00>

    > Buffer.allocUnsafe(8)         // create a buffer but don't fill it, the buffer may have old data in it
    <Buffer 04 20 00 00 00 00 00 00>
    
    > Buffer.allocUnsafe(8).fill()  // use 'fill' method to fill the buffer
    <Buffer 00 00 00 00 00 00 00 00>

`allocUnsafe` is fast, but can be unpredictable. Use with care.

Buffers can be `sliced`, but note that the slice and the original buffer share the same memory. This can have side effects.

### StringDecoder

If you're receiving UTF-8 bytes as chunks in a stream, you should always use StringDecoder as it will attempt to make sense of the stream data until it can assemble the UTF-8 character.

