<template>
  <div id="syntax-tab">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab>
        Fields
      </v-tab>
      <v-tab>
        Syntax
      </v-tab>
      <v-tab>
        History
      </v-tab>
    </v-tabs>
    <v-tabs-items style="margin-top:0" v-model="tab">
      <v-tab-item>
        <v-card
          color="basil"
          flat
        >
          <v-card-text>
            <SideBarSql/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          class="syntax-card"
          style="height: calc(100vh - 240px); overflow-y: scroll; border-radius:  0 !important;"
          color="basil"
          flat
        >
          <v-card-text>
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <span>BEGIN</span>
                  <span class="syntax-desc">(SQL PL) Begin a compound statement block</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/begin.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">compound_stmt:
                    [ <i>label</i>_name:] BEGIN [[[NOT]] ATOMIC | TRANSACTION]
                        declarations
                        statement_list
                    END [ <i>label</i>_name]
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(1)" class="fas fa-copy"></i></h5>

                  <pre id="1" xml:space="preserve">create procedure begin_trans(
                      newId char,
                          newName char) modifies sql data
                      begin transaction
                          insert into acctmgr values newId, newName, current_date(), 0.025;
                      end;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <span>CALL</span>
                  <span class="syntax-desc">Call a stored procedure</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/call.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">call_stmt:
                    CALL [<i>database</i>_name.]<i>proc</i>_name [(proc_arg[, proc_arg]...)]
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(2)" class="fas fa-copy"></i></h5>

                  <pre id="2" xml:space="preserve">create proc authors_books(lastnm char) as
                    select publ_yr, title from book where last_name = lastnm
                end proc;
                    ...
                authors_books("PotterB");
                PUBL_YR TITLE
                   1903 The Tailor of Gloucester
                   1903 The tale of Squirrel Nutkin
                   1904 The tale of Benjamin Bunny
                   1904 The tale of Peter Rabbit; thirty-one illustrations.
                   1905 The pie and the patty-pan.
                   1905 The tale of Mrs. Tiggy-Winkle
                   1906 The tale of Mr. Jeremy Fisher
                   1908 The tale of Jemima Puddle-Duck
                   1907 The tale of Tom Kitten
                   1911 The tale of Timmy Tiptoes
                   1912 The tale of Mr. Tod
                   1913 The tale of Pigling Bland
                   1918 The tale of Johnny Town-mouse
                    ...
                create procedure sold(pid char, bid char, offer double, sale_date char) as
                    start transaction
                    update book set price = offer, date_sold = sale_date where bookid = bid
                    insert into sale values bid, pid
                    commit
                end proc;
                    ...
                execute sold("SMD", "potter08", 750.0, date "2011-04-03");
                    ...</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template slot="title">
                  <span>CASE</span>
                  <span class="syntax-desc">(SQL PL) Case statement</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/case.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">case_stmt:
                    CASE value_expr
                         {WHEN = value_expr THEN statement_list}...
                         [ELSE {OKAY |&nbsp;statement_list}]
                    END CASE
               |    CASE
                         {WHEN <a href="../Grammar/conditional_expr.htm" data-mc-exclude-action="unbind" data-mc-conditions="Default.ScreenOnly">conditional_expr</a>  THEN <a href="../Grammar/statement_list.htm" data-mc-exclude-action="unbind" data-mc-conditions="Default.ScreenOnly">statement_list</a>}...
                         [ELSE {OKAY |&nbsp;<a href="../Grammar/statement_list.htm" data-mc-exclude-action="unbind" data-mc-conditions="Default.ScreenOnly">statement_list</a>}]
                    END CASE</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(3)" class="fas fa-copy"></i></h5>

                  <pre id="3" xml:space="preserve">create procedure bookshop.showcase(in a1 integer, in a2 integer)
                    begin
                        select "a1 = ", a1;
                        select "a2 = ", a2;
                        select "a1 + a2 = ", a1 + a2;
                        case a1+a2
                            when = 1 then
                                select "a1 + a2 = 1";
                            when = 2 then
                                select "a1 + a2 = 2";
                            when = 4 then
                                select "a1 + a2 = 4";
                            when = 100 then
                                select "a1 + a2 = 100";
                            else
                                select "a1 + a2 != 1, 2, 4, 100";
                                case
                                    when a1 = 2 * a2 then
                                        select "a1 = 2 * a2";
                                    when a1 = 3 * a2 then
                                        select "a1 = 3 * a2";
                                    when a1 &lt; a2 then
                                        select "a1 &lt; a2";
                                    else okay
                                end case;
                        end case;
                    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template slot="title">
                  <span>CLOSE</span>
                  <span class="syntax-desc">(SQL PL) Close an open cursor</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/close.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">close_stmt:
                    CLOSE <i>cursor</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(4)" class="fas fa-copy"></i></h5>

                  <pre id="4" xml:space="preserve">declare gr_than_avg cursor for select * from acctmgr;
                    ...
                    open gr_than_avg;
                    get_next1: loop
                       fetch gr_than_avg into l_id, l_name, l_date, l_comm;
                       if not found then
                           leave get_next1;
                       end if;
                       if l_date &gt;= lo_date and l_date &lt;= hi_date then
                           set comm_sum = comm_sum + l_comm;
                           set comm_count = comm_count + 1;
                       end if;
                    end loop get_next1;
                    close gr_than_avg;
                </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="5">
                <template slot="title">
                  <span>CLOSE DATABASE</span>
                  <span class="syntax-desc">Close an open database</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/close_database.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">close_db_stmt:
                    CLOSE&nbsp;DATABASE <i>database</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(5)" class="fas fa-copy"></i></h5>

                  <pre id="5" xml:space="preserve">open bookshop;
                    ...access bookshop database
                    <b>close database bookshop;</b>
                    open database nsfawards;
                    ...access nsfawards database
                    <b>close database nsfawards;</b>
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="6">
                <template slot="title">
                  <span>COMMIT</span>
                  <span class="syntax-desc">Commit transaction's changes to the database</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/commit.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">commit_stmt:
                    COMMIT [WORK]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(6)" class="fas fa-copy"></i></h5>

                  <pre id="6">start transaction;
                    ... insert, update, and/or delete statements
                    commit;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="7">
                <template slot="title">
                  <span>CREATE DATABASE</span>
                  <span class="syntax-desc">Create a database or schema definition</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/create_database.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">create_schema:
                    CREATE {SCHEMA |&nbsp;DATABASE}&nbsp;{<i>database</i>_name | db-uri}</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(7)" class="fas fa-copy"></i></h5>

                  <pre id="7" xml:space="preserve">create database bookshop;
                    create table author(
                        last_name   char(11) primary key,
                        full_name   char(35),
                        gender      char(1),
                        yr_born     smallint,
                        yr_died     smallint,
                        short_bio   varchar(250)
                    );
                    ... other DDL statements for the bookshop database

                    commit;</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="8">
                <template slot="title">
                  <span>CREATE FUNCTION</span>
                  <span class="syntax-desc">Create a stored function</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/create_function.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">create_function:
                    CREATE&nbsp;FUNCTION [<i>database</i>_name.]<i>func</i>_name ( [fcn_arg_decl [, fcn_arg_decl]...] )
                    RETURNS var_type
                    [LANGUAGE&nbsp;SQL]
                    [[NOT] DETERMINISTIC]
                    [CONTAINS&nbsp;SQL | {MODIFIES | READS} SQL&nbsp;DATA]
                    sqlproc_stmt
                  </pre>
                  <pre class="Grammar" xml:space="preserve">fcn_arg_decl:
                    <i>arg</i>_name var_type
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(8)" class="fas fa-copy"></i></h5>

                  <pre id="8" xml:space="preserve">create function my_sqrt(in val double, in eps double) returns double
                    begin
                        declare low, high, mid, oldmid, midsqr double;
                        if val &lt; 0.0 then
                            signal sqlcode eINVARG set message_text = "sq root of negative number";
                        end if;
                        if eps &lt;= 0.0 or eps &gt; 0.01 then
                        signal sqlcode eINVARG set message_text = "2nd arg must be &gt;= 0.0 and &lt; 0.01";
                        end if;
                        set (low, mid, high, oldmid) = (0.0, val, val, -1.0);
                        while abs(oldmid - mid) &gt;= eps do
                            set oldmid = mid;
                            set mid = (high + low)/2.0;
                            set midsqr = mid * mid;
                            if midsqr &gt; val then
                                set high = mid;
                            else
                                set low = mid;
                            end if;
                        end while;
                        return mid;
                    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="9">
                <template slot="title">
                  <span>CREATE PROCEDURE</span>
                  <span class="syntax-desc">Create a stored procedure</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/create_procedure.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">create_procedure:
                    CREATE&nbsp;PROCEDURE [<i>database</i>_name.]<i>proc</i>_name [(proc_arg_decl[, proc_arg_decl]...)]
                    [LANGUAGE&nbsp;SQL]
                    [[NOT] DETERMINISTIC]
                    [CONTAINS&nbsp;SQL |&nbsp;{MODIFIES |&nbsp;READS}&nbsp;SQL&nbsp;DATA]
                    sqlproc_stmt</pre>
                    <pre class="Grammar" xml:space="preserve">proc_arg_decl:
                      [IN |&nbsp;OUT |&nbsp;INOUT] <i>arg</i>_name var_type</pre>
                      <pre class="Grammar" xml:space="preserve">var_type:
                        non_numeric_vartype |&nbsp;numeric_vartype</pre>
                        <pre class="Grammar" xml:space="preserve">non_numeric_vartype:
                          {CHAR |&nbsp;VARCHAR}&nbsp;[(<i>length</i>_num)]
                     |    {BINARY |&nbsp;VARBINARY}&nbsp;(<i>length</i>_num)
                     |    DATE |&nbsp;TIME |&nbsp;TIMESTAMP
                     |    UUID
                     |    ROWID</pre>
                     <pre class="Grammar" xml:space="preserve">numeric_vartype:
                      REAL |&nbsp;FLOAT |&nbsp;DOUBLE
                 |    BOOLEAN |&nbsp;TINYINT |&nbsp;SMALLINT | INTEGER |&nbsp;BIGINT
                 |    DECIMAL [(<i>precision</i>_num [, <i>scale</i>_num)]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(9)" class="fas fa-copy"></i></h5>

                  <pre id="9" xml:space="preserve">create procedure n_oldest_authors(in nrows smallint)
                    begin
                       declare rowno smallint default 1;
                       get_authors: for
                            select
                            full_name,
                               if(yr_died = 0, year(current_date()), yr_died)-yr_born author_age
                            from author order by 2 desc
                       do
                            select rowno, full_name, author_age;
                            if rowno &gt; nrows then
                                leave get_authors;
                            end if;
                            set rowno = rowno + 1;
                       end for;
                    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="10">
                <template slot="title">
                  <span>deallocate prepare</span>
                  <span class="syntax-desc">Deallocate a previously prepared statement</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/deallocate_prepare.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">deallocate_stmt:
                    DEALLOCATE PREPARE <i>stmt</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(10)" class="fas fa-copy"></i></h5>

                  <pre id="10" xml:space="preserve">set stmtstr = "SELECT * FROM ACCTMGR WHERE mgrid = '" || newId || "'";
                    prepare s2 from stmtstr;
                    execute s2 into c_id, c_name, c_hired, c_commission;
                    select stat, c_id, c_name, c_hired, c_commission;
                    deallocate prepare s2;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="11">
                <template slot="title">
                  <span>declare condition</span>
                  <span class="syntax-desc">(SQL PL) Declare a condition
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/declare_condition.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">declare_condition:
                    DECLARE <i>cond</i>_name CONDITION [FOR SQLSTATE [VALUE] "string"]
               |    DECLARE <i>cond</i>_name CONDITION [FOR SQLCODE [VALUE] <i>code</i>_name]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(11)" class="fas fa-copy"></i></h5>

                  <pre id="11" xml:space="preserve">create procedure nested_handler
                    begin
                        declare v1 int default 1;
                        declare v2 int default 2;
                        declare block char(5) default "outer";
                        declare c1 condition;
                        declare c2 condition;
                        declare continue handler for c1
                            begin
                                set v1 = 10;
                                set v2 = 20;
                            end;
                        select block, v1, v2;
                        begin
                            declare block char(5) default "inner";
                            declare continue handler for c1 set v1 = 100;
                            declare continue handler for c2 set v2 = 200;
                            select block, v1, v2;
                            signal c1;
                            select block, c1, v1, v2;
                            signal c2;
                            select block, c2, v1, v2;
                        end;
                        signal c1;
                        select block, c1, v1, v2;
                    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="12">
                <template slot="title">
                  <span>DECLARE CURSOR</span>
                  <span class="syntax-desc">(SQL PL) Declare a cursor
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/declare_cursor.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">declare_cursor:
                    DECLARE <i>cursor</i>_name CURSOR [{WITH | WITHOUT} RETURN] FOR select_stmt</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(12)" class="fas fa-copy"></i></h5>

                  <pre id="12" xml:space="preserve">create procedure authors_decade(in yr smallint)
                    begin
                        declare decade, yrborn smallint;
                        declare fullname char(35);
                        declare author_found, not_found boolean default false;
                        declare authors cursor for select full_name, yr_born from author;
                        declare continue handler for not found set not_found = true;
                        set decade = (yr/10) * 10;
                        open authors;
                        find_author: loop
                            fetch authors into fullname, yrborn;
                            if not_found = true then
                                leave find_author;
                            end if;
                            if yrborn between decade and decade+9 then
                                select fullname, yrborn;
                                set author_found = true;
                            end if;
                        end loop;
                        if author_found = false then
                            select "No author found born in the decade:", decade;
                        end if;
                    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="13">
                <template slot="title">
                  <span>declare handler</span>
                  <span class="syntax-desc">Declare a condition or exception handler
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/declare_handler.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">declare_handler:
                    DECLARE {CONTINUE |&nbsp;EXIT | UNDO} HANDLER FOR condition_value_list sqlproc_stmt</pre>
                    <pre class="Grammar" xml:space="preserve">condition_value_list:
                      condition_value[, condition_value]...</pre>
                      <pre class="Grammar" xml:space="preserve">condition_value:
                        specific_condition | SQLEXCEPTION | SQLWARNING | NOT&nbsp;FOUND</pre>
                        <pre class="Grammar" xml:space="preserve">specific_condition:
                          <i>cond</i>_ name
                     |    FOR SQLSTATE [VALUE] "string"
                     |    FOR SQLCODE [VALUE] {<i>code</i>_ name |&nbsp;<i>code</i>_ num}</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(13)" class="fas fa-copy"></i></h5>

                  <pre id="13" xml:space="preserve">declare exit handler for not found
                    signal sqlcode eSQL_SIGNAL
                        set message_text = "book with that title not found";
                 </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="14">
                <template slot="title">
                  <span>declare variable</span>
                  <span class="syntax-desc">(SQL PL) Declare a variable
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/declare_variable.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">declare_variable:
                    DECLARE <i>var</i>_name[, <i>var</i>_name]... var_type [DEFAULT constant]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(14)" class="fas fa-copy"></i></h5>

                  <pre id="14" xml:space="preserve">open database bookshop;
                    declare @yr_born smallint;
                    set @yr_born = 1819;
                    create procedure var_refs(in yr_born smallint)
                    b1: begin
                        declare yr_born smallint default 1802;
                        b2: begin
                            declare yr_born smallint default 1866;
                            select full_name, yr_born from author where yr_born = b2.yr_born;
                            select full_name, yr_born from author where yr_born = b1.yr_born;
                            select full_name, yr_born from author where author.yr_born = var_refs.yr_born;
                            select full_name, yr_born from author where yr_born = @yr_born;
                            select full_name, yr_born from author b1 where b1.yr_born = var_refs.yr_born;
                       end;
                    end b1;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="15">
                <template slot="title">
                  <span>DELETE</span>
                  <span class="syntax-desc">Delete one or more rows from a table
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/delete.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">delete_stmt:
                    DELETE [<i>database</i>_name.]<i>table</i>_name&nbsp;[[AS]&nbsp;<i>correlation</i>_name]
                         [WHERE {conditional_expr | CURRENT OF <i>cursor</i>_name}]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(15)" class="fas fa-copy"></i></h5>

                  <pre id="15" xml:space="preserve">delete from book where date_sold &lt; date "2003-01-01";
                    ...
                  delete from sponsor where state &lt; "A" or state &gt; "Z";
                    ...
                  delete from person where current of SQL_CUR_f3f0_08b0;</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="16">
                <template slot="title">
                  <span>DROP DATABASE	</span>
                  <span class="syntax-desc">Drop a database
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/drop_database.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">drop_database:
                    DROP {DATABASE | SCHEMA}&nbsp;[IF EXISTS] {<i>database</i>_name | db-uri}</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">NOTE</h5>
                  <p class="note">Note that this statement is not transactional—the database is irrevocably deleted when this statement is executed. A ROLLBACK is not possible. </p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="17">
                <template slot="title">
                  <span>DROP PROCEDURE</span>
                  <span class="syntax-desc">Drop a stored procedure
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/basics/_ddl/drop_procedure.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre xml:space="preserve" class="Grammar">drop_func:
                    DROP FUNCTION <i>func</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(17)" class="fas fa-copy"></i></h5>

                  <pre id="17">drop function my_sqrt;</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="18">
                <template slot="title">
                  <span>DROP FUNCTION</span>
                  <span class="syntax-desc">Drop a stored function
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/basics/_ddl/drop_function.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre xml:space="preserve" class="Grammar">drop_proc:
                    DROP PROCEDURE <i>proc</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(18)" class="fas fa-copy"></i></h5>

                  <pre id="18" xml:space="preserve">create procedure getacct(mid char)
                    begin
                       select * from acctmgr where mgrid = mid
                    end;
                    ...
                    call getacct("JOE");
                    ...
                    drop procedure getacct;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="19">
                <template slot="title">
                  <span>DROP PROCEDURE</span>
                  <span class="syntax-desc">Drop a stored procedure
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/basics/_ddl/drop_procedure.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre xml:space="preserve" class="Grammar">drop_proc:
                    DROP PROCEDURE <i>proc</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(19)" class="fas fa-copy"></i></h5>

                  <pre id="19" xml:space="preserve">create procedure getacct(mid char)
                    begin
                       select * from acctmgr where mgrid = mid
                    end;
                    ...
                    call getacct("JOE");
                    ...
                    drop procedure getacct;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="20">
                <template slot="title">
                  <span>end</span>
                  <span class="syntax-desc">End a compound statement block
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/end.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">compound_stmt:
                    [ <i>label</i>_name:] BEGIN [[[NOT]] ATOMIC | TRANSACTION]
                         declarations
                         statement_list
                    END [ <i>label</i>_name]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(20)" class="fas fa-copy"></i></h5>

                  <pre id="20" xml:space="preserve">create procedure begin_trans(
                    newId char,
                    newName char) modifies sql data
               begin transaction
                    insert into acctmgr values newId, newName, current_date(), 0.025;
               end;
               </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="21">
                <template slot="title">
                  <span>execute</span>
                  <span class="syntax-desc">Execute a prepared statement
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/execute.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">execute_stmt:
                    EXECUTE <i>stmt</i>_name [INTO <i>var</i>_name[, <i>var</i>_name]...]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(21)" class="fas fa-copy"></i></h5>

                  <pre id="21" xml:space="preserve">set stmtstr = "SELECT * FROM ACCTMGR WHERE mgrid = '" || newId || "'";
                    prepare s2 from stmtstr;
                    execute s2 into c_id, c_name, c_hired, c_commission;
                    select stat, c_id, c_name, c_hired, c_commission;
                    deallocate prepare s2;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="22">
                <template slot="title">
                  <span>fetch</span>
                  <span class="syntax-desc">Fetch the next row from a cursor
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/fetch.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">fetch_stmt:
                    FETCH [NEXT] [FROM] <i>cursor</i>_name INTO <i>var</i>_name[, <i>var</i>_name]...</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(22)" class="fas fa-copy"></i></h5>

                  <pre id="22" xml:space="preserve">declare gr_than_avg cursor for select * from acctmgr;
                        ...
                      open gr_than_avg;
                      get_next1: loop
                          fetch gr_than_avg into l_id, l_name, l_date, l_comm;
                          if not found then
                              leave get_next1;
                          end if;
                          if l_date &gt;= lo_date and l_date &lt;= hi_date then
                              set comm_sum = comm_sum + l_comm;
                              set comm_count = comm_count + 1;
                          end if;
                      end loop get_next1;
                      close gr_than_avg;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="23">
                <template slot="title">
                  <span>for</span>
                  <span class="syntax-desc">Loop through each result row of a select statement
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/for.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">for_stmt:
                    [ <i>label</i>_name:] FOR [<i>for_loop_var</i>_name AS] [<i>cursor</i>_name CURSOR FOR]
                         select_stmt
                         DO
                                statement_list
                         END FOR [ <i>label</i>_name<]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <pre xml:space="preserve">[for_loop_var_name:] begin
                    declare variable for select_stmt result column 1;
                    declare variable for select_stmt result column 2;
                       ...
                    declare variable for select_stmt result column n;
                    declare cursor cursor_name for select_stmt;
                    open cursor_name;
                    label_name: loop
                        fetch cursor_name into col1_var, col2_var, ..., coln_var;
                        if not found then
                            leave label_name;
                        end if;
                        statement_list;
                    end loop [label];
                    close cursor_name;
                end;</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(23)" class="fas fa-copy"></i></h5>

                  <pre id="23" xml:space="preserve">create procedure authors_decade(in yr smallint)
                    begin
                        declare decade, yrborn smallint;
                        declare fullname char(35);
                        declare author_found boolean default false;

                        set decade = (yr / 10) * 10;

                        find_author: for select full_name, yr_born from author do
                            if yr_born between decade and decade + 9 then
                                select full_name, yr_born;
                                set author_found = true;
                            end if;
                        end for find_author;
                        if author_found = false then
                            select "No author found born in the decade:", decade;
                        end if;
                    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="24">
                <template slot="title">
                  <span>get diagnostics</span>
                  <span class="syntax-desc">Get diagnostic info for a statement or condition
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/get_diagnostics.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve" style="font-style: normal;">getdiags_stmt:
                    GET [CURRENT |&nbsp;STACKED] DIAGNOSTICS stmt_info[, stmt_info]...
               |    GET [CURRENT |&nbsp;STACKED] DIAGNOSTICS {EXCEPTION |&nbsp;CONDITION} cond_info[, cond_info}...</pre>
               <pre class="Grammar" xml:space="preserve">stmt_info:
                <i>var</i>_name= stmt_item</pre>
                <pre class="Grammar" xml:space="preserve">stmt_item:
                  COMMAND_FUNCTION |&nbsp;COMMAND_FUNCTION_CODE
             |    DYNAMIC_FUNCTION |&nbsp;DYNAMIC_FUNCTION_CODE
             |    MORE | NUMBER | ROW_COUNT | TRANSACTION_ACTIVE</pre>
             <pre class="Grammar" xml:space="preserve">cond_info:
              <i>var</i>_name = cond_item</pre>
              <pre class="Grammar" xml:space="preserve">cond_item:
                RETURNED_SQLSTATE | RETURNED_SQLCODE | MESSAGE_LENGTH | MESSAGE_TEXT
           |    SQLCODE_NAME | CONDITION_IDENTIFIER | CONDITION_NUMBER
           |    CURSOR_NAME | ROUTINE_NAME |&nbsp;SOURCE_FILE
           |    STATEMENT_NUMBER |&nbsp;LINE_NUMBER | COLUMN_NUMBER</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(24)" class="fas fa-copy"></i></h5>

                  <pre id="24" xml:space="preserve">declare continue handler for sqlexception
                    begin
                        get stacked diagnostics
                            cmd_name = COMMAND_FUNCTION,
                            cmd_code = COMMAND_FUNCTION_CODE,
                            dyn_name = DYNAMIC_FUNCTION,
                            dyn_code = DYNAMIC_FUNCTION_CODE;
                        get stacked diagnostics condition 1
                            errcode = SQLCODE_NAME,
                            errmsg = MESSAGE_TEXT;
                    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="25">
                <template slot="title">
                  <span>if</span>
                  <span class="syntax-desc">If – then – else statement
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/if.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">if_stmt:
                    IF conditional_expr THEN statement_list
                    [ELSEIF conditional_expr THEN statement_list]...
                    [ELSE statement_list]
                    END  IF</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(25)" class="fas fa-copy"></i></h5>

                  <pre id="25" xml:space="preserve">if n &lt; 0 then
                    set x = n * pi();
                    set i = -1;
                elseif n = 0 then
                    set x = pi();
                    set i = 0;
                elseif n = 1 then
                    set x = pi() / 4.0;
                    set i = 1;
                elseif n &lt; 10 then
                    set i = 10 * n;
                    if n &lt; 3 then
                        set x = 3.0 * pi();
                    elseif n &lt; 7 then
                        set x = 7.0 * pi();
                    else
                        set x = 10.0 * pi();
                    end if;
                else
                    set i = 1000;
                    set x = 0.0;
                end if;
                </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="26">
                <template slot="title">
                  <span>initialize database	</span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/initialize_database.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">init_db_stmt:
                    INITIALIZE [DATABASE] <i>database</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(26)" class="fas fa-copy"></i></h5>

                  <pre id="26">open database bookshop exclusive;
                    <b>initialize bookshop;</b><!--[CDATA[
                    ]]-->
                    ...import bookshop tables
                    commit;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="27">
                <template slot="title">
                  <span>insert </span>
                  <span class="syntax-desc">Insert a row or rows into a table
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/insert.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">insert_stmt:
                    INSERT INTO [<i>database</i>_name.]<i>table</i>_name [( <i>column</i>_name [, <i>column</i>_name]... )] data_source</pre>
                    <pre class="Grammar" xml:space="preserve">data_source:
                      VALUES insert_value_list
                 |    [FROM] select_stmt</pre>
                 <pre class="Grammar" xml:space="preserve">insert_value_list:
                  [value_expr] [, [value_expr]]...
             |    ( [value_expr] [, [value_expr]]... )</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <pre xml:space="preserve">create table acctmgr(
                    mgrid       rowid primary key,
                    name        char(24),
                    hire_date   date,
                    commission  double
                );</pre>
                <pre xml:space="preserve">insert into acctmgr values ,"Sam Smith",@"2010-04-01",0.05;</pre>
                <h5 class="sub-headers" style="padding-top: 15px;">Example</h5>
                <pre>insert into author values "BarrieJ", "Barrie, J. M. (James Matthew)", "M", 1860, 1937,
                  "Scottish author/dramatist, best remembered today as the creator of Peter Pan.";
              insert into book values "descartes01", "DescartesR", "Principia philosophiae",
                 "12 p.l., 310 p. illus., diagrs. 21 cm.", "Amstelodami, apud Ludovicum Elzevirium",
                 1644, "B1860  1644", date "2010-09-22", null, 1.20*cost, 12750.0;
                 ...
              insert into se_tfs.nsforg select * from ne_tfs.nsforg;
                ...
              insert into person(name) values "Unknown, Manager";</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="28">
                <template slot="title">
                  <span>iterate </span>
                  <span class="syntax-desc">Go to next iteration of the specified loop
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/iterate.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">insert_stmt:
                    INSERT INTO [<i>database</i>_name.]<i>table</i>_name [( <i>column</i>_name [, <i>column</i>_name]... )] data_source</pre>
                    <pre class="Grammar" xml:space="preserve">iterate_stmt:
                      ITERATE  <i>label</i>_name</pre>
                <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(28)" class="fas fa-copy"></i></h5>
                <pre id="28" xml:space="preserve">create procedure bio_match(in match_str char)
                  begin
                      declare author_name char(30) default null;
                      declare author_bio varchar(216) default null;
                      declare nfm char(45) default "No author found with short_bio containing:";
                      my_for: for author_row as authors cursor for
                          select * from author
                      do
                          if locate(match_str, author_row.short_bio, 1) == 0 then
                              iterate my_for;
                          end if;
                          set author_name = author_row.full_name;
                          set author_bio = author_row.short_bio;
                          select author_name, author_bio;
                      end for my_for;
                      if author_name is null then
                          select nfm, match_str;
                      end if;
                  end;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="29">
                <template slot="title">
                  <span>leave </span>
                  <span class="syntax-desc">Leave (exit) the specified loop
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/leave.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">leave_stmt:
                    LEAVE  <i>label</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(29)" class="fas fa-copy"></i></h5>
                <pre id="29" xml:space="preserve">create procedure bio_match(in bio_string char)
                  begin
                      declare author_name char(30) default null;
                      declare author_bio char(216) default null;
                      fetch_author: for author_row as authors cursor for
                          select * from author
                      do
                          if locate(bio_string, author_row.short_bio, 1) != 0 then
                              set author_name = author_row.full_name;
                              set author_bio = author_row.short_bio;
                              leave fetch_author;
                          end if;
                      end for;
                      if author_name is null then
                          select "No author found with short_bio containing:", bio_string;
                      else
                          select author_name, author_bio;
                      end if;
                  end;
                 </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="30">
                <template slot="title">
                  <span>loop </span>
                  <span class="syntax-desc">Loop statement
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/loop.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">loop_stmt:
                    [ <i>label</i>_name:] LOOP statement_list END  LOOP [ <i>label</i>_name]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(30)" class="fas fa-copy"></i></h5>
                <pre id="30" xml:space="preserve">find_author: loop
                  fetch authors into author_row;
                  if end_of_search = true then
                      leave find_author;
                  end if;
                  if author_row.yr_born between decade and decade + 9 then
                      set numfound = numfound + 1;
                      select numfound, author_row.full_name, author_row.yr_born;
                  end if;
              end loop;
              </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="31">
                <template slot="title">
                  <span>open </span>
                  <span class="syntax-desc">Open a cursor
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/open.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">open_stmt:
                    OPEN <i>cursor</i>_name</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(31)" class="fas fa-copy"></i></h5>

                  <pre id="31" xml:space="preserve">declare gr_than_avg cursor for select * from acctmgr;
                      ...
                      open gr_than_avg;
                      get_next1: loop
                         fetch gr_than_avg into l_id, l_name, l_date, l_comm;
                         if not found then
                             leave get_next1;
                         end if;
                         if l_date &gt;= lo_date and l_date &lt;= hi_date then
                             set comm_sum = comm_sum + l_comm;
                             set comm_count = comm_count + 1;
                         end if;
                      end loop get_next1;
                      close gr_than_avg;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="32">
                <template slot="title">
                  <span>open database</span>
                  <span class="syntax-desc">Open a database
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/open_database.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">open_db_stmt:
                    {OPEN&nbsp;DATABASE |&nbsp;USE} {<i>database</i>_name |&nbsp;db-uri} [open_mode]
               |    {OPEN&nbsp;DATABASE |&nbsp;USE} <i>database</i>_name AS UNION OF db-uri[, db-uri]...
                  </pre>
                  <pre class="Grammar" xml:space="preserve">open_mode:
                    open_mode_spec
               |    IN&nbsp;open_mode_spec&nbsp;[MODE]
                  </pre>
                  <pre class="Grammar" xml:space="preserve">open_mode_spec:
                    SHARE | EXCLUSIVE | READ&nbsp;ONLY
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(32)" class="fas fa-copy"></i></h5>

                  <pre id="32" xml:space="preserve">open bookshop exclusive;

                    insert into author values "BarrieJ", "Barrie, J. M. (James Matthew)", "M", 1860, 1937,
                        "Scottish author and dramatist, best remembered today as the creator of Peter Pan.";
                      ...
                    open database nsfawards as union of "tfs-tcp://Northeast_TFS:1650", "tfs-tcp://Southeast_TFS:1650",
                      "tfs-tcp://Midwest_TFS:1650", "tfs-tcp://West_TFS:1650";

                    start read only transaction;
                    select state, sum(amount) from award join sponsor on sponsor_nm = name group by state;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="33">
                <template slot="title">
                  <span>persist database</span>
                  <span class="syntax-desc">Persist an open in-memory database
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/persist_database.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">persist_db_stmt:
                    PERSIST DATABASE&nbsp;{<i>database</i>_name | db-uri}
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(33)" class="fas fa-copy"></i></h5>

                  <pre id="33" xml:space="preserve">persist database bookshop;</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="34">
                <template slot="title">
                  <span>prepare</span>
                  <span class="syntax-desc">Prepare an SQL statement
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/prepare.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">prepare_stmt:
                    PREPARE <i>stmt</i>_name FROM {<i>var</i>_name |&nbsp;string_expr}
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(34)" class="fas fa-copy"></i></h5>

                  <pre id="34" xml:space="preserve">set stmtstr = "SELECT * FROM ACCTMGR WHERE mgrid = '" || newId || "'";
                    prepare s2 from stmtstr;
                    execute s2 into c_id, c_name, c_hired, c_commission;
                    select stat, c_id, c_name, c_hired, c_commission;
                    deallocate prepare s2;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="35">
                <template slot="title">
                  <span>release savepoint</span>
                  <span class="syntax-desc">Release a transaction savepoint
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/release_savepoint.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">release_stmt:
                    RELEASE&nbsp;SAVEPOINT <i>savepoint_id</i>
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(35)" class="fas fa-copy"></i></h5>

                  <pre id="35" xml:space="preserve">start trans;
                    insert into acctmgr ... <i>new account manager</i>
                    savepoint new_patron;
                    insert into patron ... <i>new patron for new acct manager</i>
                    insert into patron ... <i>another for the new acct manager</i>
                      ... <i>no problems encountered</i>      <!--[CDATA[
                    ]]--><b>release savepoint new_patron;</b>
                    ... <i>other changes</i>
                    commit;
                  </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="36">
                <template slot="title">
                  <span>repeat until</span>
                  <span class="syntax-desc">Repeat execution of a list of statements until a condition becomes true
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/repeat_until.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">repeat_stmt:
                      [ <i>label</i>_name:] REPEAT
                           statement_list
                      UNTIL conditional_expr END REPEAT [ <i>label</i>_name]
                  </pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(36)" class="fas fa-copy"></i></h5>

                  <pre id="36" xml:space="preserve">create procedure cflow(i1 int, i2 int)

  begin
      declare ii, ij int;
      if i1 &lt; i2 then
          set (ii, ij) = (i1, i1);
          w_loop: while ii &lt;= i2 do
              set ij = ij * ii;
              select i1, i2, ii, ij;
              set ii = ii + 1;
              if ii &gt; 100 then
                  leave w_loop;
              end if;
          end while;
      else
          set (ii, ij) = (i2, i1);
          r_loop: repeat
              set ij = ij + ii;
              select i1, i2, ii, ij;
              set ii = ii + 1;
              if ii &gt; 100 then
                  leave r_loop;
              end if;
          until ii &gt; i1 end repeat;
      end if;
    end;
                    </pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="37">
                <template slot="title">
                  <span>resignal</span>
                  <span class="syntax-desc">Resignal a condition or exception
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/resignal.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">resignal_stmt:
            RESIGNAL specific_condition [SET MESSAGE_TEXT = "string"]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(37)" class="fas fa-copy"></i></h5>

                  <pre id="37" xml:space="preserve">create procedure duptest(out stat int)
modifies sql data
begin
    declare stmt_name char(24);
    declare tractive smallint;
    declare scode char(20);
    declare sstate char(5);
    declare msgtext char(45);
    declare continue handler for sqlexception
    begin
        get diagnostics stmt_name = command_function, tractive = transaction_active;
        get diagnostics condition 1 scode = sqlcode_name, msgtext = message_text;
        set stat = 0;
    end;
    insert into acctmgr values "WAYNE", "Warren, Wayne", current_date(), 0.025;
    begin atomic
        declare exit handler for sqlcode eDUPLICATE
        begin
            set stat = 1;
            resignal;
        end;
        insert into acctmgr values "SCOTT", "Merilatt, Scott", current_date(), 0.025;
        insert into acctmgr values "RANDY", "Johnson, Randy", current_date(), 0.025;
        insert into acctmgr values "MARCO", "Rubio, Marco", current_date(), 0.025;
        set stat = 2;
    end;
    set stat = 3;
    select stat, stmt_name, tractive, scode, msgtext;
end;
</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="38">
                <template slot="title">
                  <span>rollback</span>
                  <span class="syntax-desc">Rollback (undo) a transaction's changes
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/rollback.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">rollback_stmt:
          ROLLBACK [WORK] [[TO&nbsp;SAVEPOINT] <i>savepoint_id</i>]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(38)" class="fas fa-copy"></i></h5>

                  <pre id="38" xml:space="preserve">start transaction;
 	... /* make some changes to the database */

 	... /* system detects invalid data */
rollback;</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="39">
                <template slot="title">
                  <span>savepoint</span>
                  <span class="syntax-desc">Mark a transaction savepoint
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/savepoint.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre xml:space="preserve" class="Grammar">savepoint_stmt:
          SAVEPOINT <i>savepoint_id</i></pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(39)" class="fas fa-copy"></i></h5>

                  <pre id="39">start trans;
insert into acctmgr ... new account manager
<b>savepoint new_patron;</b>
insert into patron ... <i>new patron for new acct manager</i>
insert into patron ... <i>another for the new acct manager</i>
	... <i>discover problem with new patrons</i>
rollback savepoint to new_patron;
commit;
</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="40">
                <template slot="title">
                  <span>select</span>
                  <span class="syntax-desc">Retrieve a set of rows of data from the database
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/select.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">select_stmt:
          SELECT [FIRST |&nbsp;ALL | DISTINCT] select_item [, select_item]...
               FROM table_ref [, table_ref]...
               [WHERE conditional_expr]
               [grouping | sorting | grouping sorting]
               [LIMIT (num {ROWS |&nbsp;MINS&nbsp;|&nbsp;SECS&nbsp;|&nbsp;MSECS})]
               [FOR UPDATE [OF <i>column</i>_name [, <i>column</i>_name]...]]</pre>
                  <pre class="Grammar" xml:space="preserve">conditional_expr:
        relational_expr [{ AND |&nbsp;OR} relational_expr]...</pre>
                  <pre class="Grammar" xml:space="preserve">sub_query:
          ( sub_select )</pre>
                  <pre class="Grammar" xml:space="preserve">sub_select:
          SELECT {* | named_expr} FROM table_ref [, table_ref]...
               [WHERE conditional_expr] [grouping]
</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(40)" class="fas fa-copy"></i></h5>

                  <pre id="40" xml:space="preserve">select name, sum(amount) from sponsor join award on sponsor_nm = name
    group by name order by 2 desc;
	...
select sum(if(gender="M",1,0)) men, sum(if(gender="F",1,0)) women
 	from award natural join investigator natural join person;
	...
select loc_long, loc_lat, convert(rdg_time,date), hour(rdg_time),
 		avg(temperature), avg(pressure), avg(humidity), avg(light) from weather_data
 		group by 1,2,4
 		limit(4 hours);
	...
select bookid, publ_year, last_name, title from book where publ_year &lt; 1800;
	...
select aucid, count(*) from auction natural join bid where start_date = curdate()
	group by 1;
	...</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="41">
                <template slot="title">
                  <span>set open mode</span>
                  <span class="syntax-desc">Set the default database open mode
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/set_open_mode.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">set_default_open_mode:
          SET [DEFAULT] OPEN MODE [TO | =] open_mode_spec</pre>
                  <pre class="Grammar" xml:space="preserve">open_mode_spec:
          SHARE | EXCLUSIVE | READ&nbsp;ONLY</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="42">
                <template slot="title">
                  <span>set storage media</span>
                  <span class="syntax-desc">Set the storage media type
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/set_storage_media.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">set_storage_media:
          SET STORAGE  [TO | =]
               {ONDISK |&nbsp;INMEMORY_VOLATILE |&nbsp;INMEMORY_KEEP |&nbsp;INMEMORY_PERSIST}</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(42)" class="fas fa-copy"></i></h5>

                  <pre id="42" xml:space="preserve" style="font-weight: normal;">set storage media to inmemory_load;
open database nsfawards;
</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="43">
                <template slot="title">
                  <span>set variable value</span>
                  <span class="syntax-desc">Set a variable to a value
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/set_variable_value.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">asgt_stmt:
          SET var_ref = value_expr
     |    SET ( var_ref [, var_ref]... ) = ( value_expr [, value_expr]... )
</pre>
                  <pre class="Grammar" xml:space="preserve">var_ref:
          [@]<i>var</i>_name</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="44">
                <template slot="title">
                  <span>set control option</span>
                  <span class="syntax-desc">Set an SQL operational parameter value
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/set_control_option.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">set_option:
          SET DATE FORMAT [TO | =]
               {"YYYY-MM-DD" | "MM-DD-YYYY" | "DD-MM-YYYY"
              |  "YYYY/MM/DD" | "MM/DD/YYYY" | "DD/MM/YYYY"}
     |    SET TIME FORMAT [TO | =] "HH[:MM[:SS[:F[F[F[F]]]]]]"
     |    SET WILD ALL [TO | =] {"%" | "*"}
     |    SET WILD ONE [TO | =] {"_" | "." | "?"}
     |    SET TIMEOUT [TO | =]integer
     |    SET {DISTINCT | GROUP&nbsp;BY | ORDER&nbsp;BY} CACHE&nbsp;SIZE [TO | =] integer
     |    SET SORT&nbsp;COST&nbsp;FACTOR [TO | =] decimal
     |    SET IGNORE IMPORT ERROR [TO | =] {ON | OFF}</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(44)" class="fas fa-copy"></i></h5>

                  <pre id="44" xml:space="preserve" style="font-weight: normal;">set order by cache size to 5000;
set group by cache size to 10000;
set distinct cache size to 1000;
    ...
set timeout to 5;
</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="45">
                <template slot="title">
                  <span>set statistics</span>
                  <span class="syntax-desc">Set UPDATE STATISTICS execution control options
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/set_statistics.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">set_stats:
          SET {STATISTICS | STATS}
          [ HISTOSIZE [=] num ]
          [ SAMPLING [=] (<i>pct</i>_num, <i>minrows</i>_num, <i>maxrows</i>_num) ]
          [ AUTORUN [=] (<i>pct</i>_num, <i>minrows</i>_num) ]
          [ THREADS [=] num]
</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(45)" class="fas fa-copy"></i></h5>

                  <pre id="45">open bookshop;
<b>set stats histosize=35 sampling=(20,100,5000) autorun=(20,1000) threads=4;</b>
update stats on bookshop;
select dbname, exectime, totrows, memreqd from sys$dbstats;
DBNAME                    EXECTIME              TOTROWS     MEMREQD
bookshop                      0.06                 2586       88743

select colname, entry, histo_eq_tot, histo_val from sys$colhisto
    where colname = "publ_year";
COLNAME             ENTRY   HISTO_EQ_TOT HISTO_VAL
publ_year               1              1 1644
publ_year               2              1 1651
publ_year               3              1 1674
publ_year               4              1 1805
publ_year               5              1 1816
publ_year               6              1 1822
publ_year               7              1 1840
publ_year               8              1 1843
publ_year               9              2 1846
publ_year              10              3 1848
publ_year              11              2 1852
publ_year              12              1 1853
publ_year              13              1 1854
publ_year              14              2 1855
publ_year              15              3 1864
publ_year              16              2 1865
publ_year              17              2 1873
publ_year              18              1 1875
publ_year              19              1 1876
publ_year              20              2 1879
publ_year              21              1 1881
publ_year              22              1 1886
publ_year              23              1 1887
publ_year              24              1 1888
publ_year              25              1 1889
publ_year              26              3 1894
publ_year              27              2 1897
publ_year              28              2 1899
publ_year              29              3 1902
publ_year              30              3 1906
publ_year              31              3 1911
publ_year              32              1 1917
publ_year              33              1 1920
publ_year              34              2 1922
publ_year              35              1 1939
</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="46">
                <template slot="title">
                  <span>set transaction</span>
                  <span class="syntax-desc">Set transaction operational mode
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/set_transaction.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">set_transaction:
          SET TRANSACTION READ {ONLY | WRITE} [ISOLATION&nbsp;LEVEL iso_level]
     |    SET TRANSACTION AUTOCOMMIT [TO | =] {ON | OFF}
</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(46)" class="fas fa-copy"></i></h5>

                  <pre id="46">set transaction read;
start transaction;
...  – insert, update, delete statements are not allowed
commit;
</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="47">
                <template slot="title">
                  <span>signal</span>
                  <span class="syntax-desc">Signal a condition or exception
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/signal.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">signal_stmt:
          SIGNAL specific_condition [SET MESSAGE_TEXT = "string"]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(47)" class="fas fa-copy"></i></h5>

                  <pre id="47" xml:space="preserve">create procedure nested_handler
begin
    declare v1 int default 1;
    declare v2 int default 2;
    declare block char(5) default "outer";
    declare c1 condition;
    declare c2 condition;
    declare continue handler for c1
        begin
            set v1 = 10;
            set v2 = 20;
        end;
    select block, v1, v2;
    begin
        declare block char(5) default "inner";
        declare continue handler for c1 set v1 = 100;
        declare continue handler for c2 set v2 = 200;
        select block, v1, v2;
        signal c1;
        select block, c1, v1, v2;
        signal c2;
        select block, c2, v1, v2;
    end;
    signal c1;
    select block, c1, v1, v2;
end;
</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="48">
                <template slot="title">
                  <span>start transaction</span>
                  <span class="syntax-desc">Signal a condition or exception
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/start_transaction.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">start_stmt:
          START&nbsp;TRANSACTION [<i>transid</i>_name] [transact_item [, transact_item]...]</pre>
                  <pre class="Grammar" xml:space="preserve">transact_item:
          {READ {ONLY | WRITE}&nbsp;|&nbsp;UPDATE} [ON table_list]
     |    isolation level iso_level</pre>
                  <pre class="Grammar" xml:space="preserve">table_list:
          <i>database</i>_name.]<i>table</i>_name [, [<i>database</i>_name.]<i>table</i>_name]...</pre>
                  <pre class="Grammar" xml:space="preserve">iso_level:
          READ UNCOMMITTED
    |     READ COMMITED
    |     REPEATABLE READ
    |     SERIALIZABLE
</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(48)" class="fas fa-copy"></i></h5>

                  <pre id="48" xml:space="preserve">...connection alpha...
START&nbsp;TRANSACTION READ&nbsp;ONLY;
    ... issue a series of select statements

...meanwhile, over at connection omega...
START&nbsp;TRANSACTION;
    ... issue a series of related insert, update, and delete statements
commit;   -- alpha cannot see omega's changes

...back at alpha...
commit;   -- ends alpha's read only transactions
    ... subsequent reads can now see omega's changes</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="49">
                <template slot="title">
                  <span>update</span>
                  <span class="syntax-desc">Update one or more rows in a table
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/update.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">update_stmt:
          UPDATE [<i>database</i>_name.]<i>table</i>_name&nbsp;[[AS]&nbsp;<i>correlation</i>_name]
                 SET <i>column</i>_name = value_exp [, <i>column</i>_name = value_expr]...
                 [WHERE {conditional_expr | CURRENT OF <i>cursor</i>_name}]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(49)" class="fas fa-copy"></i></h5>

                  <pre id="49" xml:space="preserve">start trans;

<b>update author set last_name = "BronteE" where last_name = "Bronte";</b>

insert into author values "BronteC", "Bronte, Charlotte", "F", 1816, 1855,
    "English novelist, one of the 3 sisters whose novels are English lit. standards.";

commit;</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="50">
                <template slot="title">
                  <span>update statistics</span>
                  <span class="syntax-desc">Update statistics for a database
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/update_statistics.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">upd_stats_stmt:
               UPDATE {STATISTICS |&nbsp;STATS}&nbsp;ON <i>database</i>_name</pre>
                </div>
              </el-collapse-item>
              <el-collapse-item name="51">
                <template slot="title">
                  <span>while</span>
                  <span class="syntax-desc">Repeat execution of a list of statements while a condition is true
                  </span>
                </template>
                <div>
                  <h5 class="sub-headers" style="padding-top: 15px;">Description</h5>
                  <a target="_blank" href="https://docs.raima.com/rdm/15_2/ug/sql/_ref/while.htm">Click to see full documentation</a>
                  <h5 class="sub-headers" style="padding-top: 15px;">Syntax</h5>
                  <pre class="Grammar" xml:space="preserve">while_stmt:
          [ <i>label</i>_name:] WHILE conditional_expr
               statement_list
          END WHILE [ <i>label</i>_name]</pre>
                  <h5 class="sub-headers" style="padding-top: 15px;">Example <i @click="copyExampleCode(50)" class="fas fa-copy"></i></h5>

                  <pre id="50" xml:space="preserve">create procedure cflow(i1 int, i2 int)
begin
    declare ii, ij int;
    if i1 &lt; i2 then
        set (ii, ij) = (i1, i1);
        w_loop: while ii &lt;= i2 do
            set ij = ij * ii;
            select i1, i2, ii, ij;
            set ii = ii + 1;
            if ii &gt; 100 then
                leave w_loop;
            end if;
        end while;
    else
        set (ii, ij) = (i2, i1);
        r_loop: repeat
            set ij = ij + ii;
            select i1, i2, ii, ij;
            set ii = ii + 1;
            if ii &gt; 100 then
                leave r_loop;
            end if;
        until ii &gt; i1 end repeat;
    end if;
end;
</pre>
                </div>
              </el-collapse-item>
            </el-collapse>

          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          color="basil"
          flat
        >
          <v-card-text>
            <ul style="list-style: none;" v-if="historyList.length">
              <li v-for="(history,key) in historyList" :key="key">
                {{key+1}} - {{history}}
                <v-btn @click="copyQuery(history)" class="sql-btn" text color="secondary">
                  <i class="fas fa-copy mr-1" aria-hidden="true"></i>
                </v-btn>
              </li>
            </ul>
            <p class="text-center" v-else>Your history is empty</p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>

</template>

<script>
import SideBarSql from "../../../../components/Raima/SidebarPlugin/SidebarSql.vue"
export default {
  name: "Syntax",
  components: {SideBarSql},
  props: {historyList: Array},
  data() {
    return {
      tab: null,
      show: false,
    }
  },
  methods: {
    copyQuery(query) {
      this.$emit("copyQuery", query);
    },
    copyExampleCode(IDNo) {
      const copyText = document.getElementById(IDNo).textContent;
      const textArea = document.createElement('textarea');
      textArea.classList.add('copy-text');
      textArea.textContent = copyText;
      document.body.append(textArea);
      textArea.select();
      document.execCommand("copy");
    }
  }
}
</script>

<style lang="scss">
h5 {
  color: black !important;
}

.v-card__text {
  background: #1f2931 !important;
  color: white !important;
}

table th,
table td {
  text-align: left;
}
table tr {
  border-bottom: 1px solid #ffffff;
  padding: 3px 0px !important;
}
a {
  color: #ffffff !important;
}

.el-collapse-item__wrap {
  background: transparent !important;
}
.el-collapse-item__header {
  background: transparent !important;
  color: white !important;
}

h5 {
  font-weight: 600 !important;
}

pre {
    border: thin solid rgba(0, 0, 0, 0.12);
    border-left: 3px solid #da465c;
    color: #666;
    font-family: monospace;
    margin-bottom: 1.6em;
    padding: 1em 1.5em;
    display: block;
    line-height: 1;
    font-size: 10pt;
    margin: 0;
  &.Grammar {
    background: rgba(0, 0, 0, 0.05) !important;
  }
}

.el-collapse-item__content {
  pre {
    text-transform: uppercase;
  }
}

.el-collapse-item__header {
  height: auto !important;
  line-height: 32px !important;
}

.el-collapse-item__header {
  span {
    font-size: 14px;
    width:50%;
  }
  span.syntax-desc {
    font-size: 10px;
    margin-left: 20px;
    position: relative;
    &:before {
      content: '-';
      left: -10px;
      position: absolute;
    }
  }
}

.v-card__text {
  border-radius: 0 !important;
}

.el-collapse-item {
  a {
    color: #da465c !important;
  }
}

#syntax-tab .theme--light.v-tabs>.v-tabs-bar {
  border: none !important;
}


#syntax-tab .el-collapse {
  border-top: none;
}

.v-tabs-slider-wrapper {
  display: none;
}

.el-collapse-item__header span {
  text-transform: uppercase;
}

.el-collapse-item__header span.syntax-desc {
  text-transform: lowercase;
}

.sub-headers i {
  cursor: pointer;
}

textarea.copy-text {
  position: absolute;
  left: -100%;
}


.syntax-card .el-collapse .el-collapse-item:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.el-collapse-item__header {
  border-bottom: thin solid hsla(0, 0%, 100%, 0.1) !important
}


</style>
