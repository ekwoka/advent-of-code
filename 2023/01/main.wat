(module
  (import "env" "log" (func $log_num (param i32)))
  (import "env" "next" (func $get_next (result i32)))

  (func $main (export "partone")
    (local.set $sum (i32.const 0))
    (loop $lines
      (local.set $first (i32.const 0))
      (local.set $second (i32.const 0))
      (loop $chars
        (local.set $char (call $get_next))
        (if (i32.lt_s (local.get $char) (i32.const 58))
          (then
            (if (i32.gt_s (local.get $char) (i32.const 48))
              (then
                if (i32.eq (local.get $first) (i32.const 0))
                  (then
                    (local.set $first (i32.sub (local.get $char) (i32.const 48)))
                  )
                  (else
                    (local.set $second (i32.sub (local.get $char) (i32.const 48)))
                  )
              )
            )
          )
        )
      )
      )
  )
)
